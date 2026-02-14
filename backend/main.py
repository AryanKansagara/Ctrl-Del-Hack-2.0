"""Remember Me MVP — FastAPI backend."""
import json
import os
from contextlib import asynccontextmanager

from dotenv import load_dotenv
load_dotenv()
from datetime import date
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import httpx

from database import get_db, init_db
from models import Person, Conversation, Reminder, EmergencyContact
from schemas import (
    PersonCreate,
    PersonUpdate,
    PersonResponse,
    PersonForRecognition,
    ConversationCreate,
    ConversationResponse,
    SummarizeAndSaveRequest,
    ReminderCreate,
    ReminderUpdate,
    ReminderResponse,
    EmergencyContactCreate,
    EmergencyContactUpdate,
    EmergencyContactResponse,
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield
    # shutdown if needed


app = FastAPI(
    title="Remember Me API",
    version="0.1.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def descriptor_to_list(desc_str):
    if not desc_str:
        return None
    try:
        return json.loads(desc_str)
    except (json.JSONDecodeError, TypeError):
        return None


# ---------- People ----------
@app.get("/api/people", response_model=list[PersonResponse])
def list_people(db: Session = Depends(get_db)):
    people = db.query(Person).order_by(Person.name).all()
    out = []
    for p in people:
        d = descriptor_to_list(p.face_descriptor)
        out.append(
            PersonResponse(
                id=p.id,
                name=p.name,
                relationship=p.relationship,
                about=p.about,
                photo_base64=p.photo_base64,
                face_descriptor=d,
                with_you_today=p.with_you_today,
            )
        )
    return out


@app.get("/api/people/for-recognition", response_model=list[PersonForRecognition])
def list_people_for_recognition(db: Session = Depends(get_db)):
    """Lightweight list for face recognition (descriptor required)."""
    people = db.query(Person).filter(Person.face_descriptor.isnot(None)).order_by(Person.name).all()
    return [
        PersonForRecognition(
            id=p.id,
            name=p.name,
            relationship=p.relationship,
            face_descriptor=descriptor_to_list(p.face_descriptor),
        )
        for p in people
    ]


@app.get("/api/people/{person_id}", response_model=PersonResponse)
def get_person(person_id: int, db: Session = Depends(get_db)):
    p = db.query(Person).filter(Person.id == person_id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Person not found")
    return PersonResponse(
        id=p.id,
        name=p.name,
        relationship=p.relationship,
        about=p.about,
        photo_base64=p.photo_base64,
        face_descriptor=descriptor_to_list(p.face_descriptor),
        with_you_today=p.with_you_today,
    )


@app.post("/api/people", response_model=PersonResponse)
def create_person(data: PersonCreate, db: Session = Depends(get_db)):
    p = Person(
        name=data.name,
        relationship=data.relationship,
        about=data.about,
        photo_base64=data.photo_base64,
        face_descriptor=json.dumps(data.face_descriptor) if data.face_descriptor else None,
        with_you_today=data.with_you_today,
    )
    db.add(p)
    db.commit()
    db.refresh(p)
    return PersonResponse(
        id=p.id,
        name=p.name,
        relationship=p.relationship,
        about=p.about,
        photo_base64=p.photo_base64,
        face_descriptor=data.face_descriptor,
        with_you_today=p.with_you_today,
    )


@app.patch("/api/people/{person_id}", response_model=PersonResponse)
def update_person(person_id: int, data: PersonUpdate, db: Session = Depends(get_db)):
    p = db.query(Person).filter(Person.id == person_id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Person not found")
    if data.name is not None:
        p.name = data.name
    if data.relationship is not None:
        p.relationship = data.relationship
    if data.about is not None:
        p.about = data.about
    if data.photo_base64 is not None:
        p.photo_base64 = data.photo_base64
    if data.face_descriptor is not None:
        p.face_descriptor = json.dumps(data.face_descriptor)
    if data.with_you_today is not None:
        p.with_you_today = data.with_you_today
    db.commit()
    db.refresh(p)
    return get_person(person_id, db)


@app.delete("/api/people/{person_id}")
def delete_person(person_id: int, db: Session = Depends(get_db)):
    p = db.query(Person).filter(Person.id == person_id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Person not found")
    db.delete(p)
    db.commit()
    return {"ok": True}


# ---------- Conversations ----------
@app.get("/api/people/{person_id}/conversations", response_model=list[ConversationResponse])
def list_conversations(person_id: int, db: Session = Depends(get_db)):
    convs = db.query(Conversation).filter(Conversation.person_id == person_id).order_by(Conversation.date.desc()).all()
    return [ConversationResponse(id=c.id, person_id=c.person_id, date=c.date, summary=c.summary) for c in convs]


@app.get("/api/people/{person_id}/last-conversation", response_model=ConversationResponse | None)
def get_last_conversation(person_id: int, db: Session = Depends(get_db)):
    c = db.query(Conversation).filter(Conversation.person_id == person_id).order_by(Conversation.date.desc()).first()
    if not c:
        return None
    return ConversationResponse(id=c.id, person_id=c.person_id, date=c.date, summary=c.summary)


@app.post("/api/conversations", response_model=ConversationResponse)
def create_conversation(data: ConversationCreate, db: Session = Depends(get_db)):
    person = db.query(Person).filter(Person.id == data.person_id).first()
    if not person:
        raise HTTPException(status_code=404, detail="Person not found")
    c = Conversation(person_id=data.person_id, date=data.date, summary=data.summary)
    db.add(c)
    db.commit()
    db.refresh(c)
    return ConversationResponse(id=c.id, person_id=c.person_id, date=c.date, summary=c.summary)


GROQ_API_KEY = os.environ.get("GROQ_API_KEY")
GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"
SUMMARY_MODEL = "llama-3.1-8b-instant"


def _summarize_transcript(transcript: str) -> str:
    """Call Groq to produce a 1-2 line reminder of what was talked about (no quoting)."""
    if not GROQ_API_KEY:
        raise HTTPException(
            status_code=503,
            detail="Groq API key not configured. Set GROQ_API_KEY.",
        )
    text = (transcript or "").strip()[:8000]
    if not text:
        return "No conversation recorded."
    prompt = (
        "Below is a conversation. Write exactly 1-2 short lines that remind the reader what they talked about. "
        "Do NOT quote the conversation word for word. Just state the topic or gist in plain language (e.g. 'Talked about the garden and weekend plans.'). "
        "Output only those 1-2 lines, nothing else.\n\nConversation:\n"
    ) + text
    try:
        with httpx.Client(timeout=30.0) as client:
            r = client.post(
                GROQ_URL,
                headers={
                    "Authorization": f"Bearer {GROQ_API_KEY}",
                    "Content-Type": "application/json",
                },
                json={
                    "model": SUMMARY_MODEL,
                    "messages": [{"role": "user", "content": prompt}],
                },
            )
            r.raise_for_status()
            data = r.json()
            choices = data.get("choices") or []
            if choices:
                content = (choices[0].get("message") or {}).get("content") or ""
                summary = (content or "").strip()
                if summary:
                    return summary[:500]
    except httpx.HTTPError as e:
        raise HTTPException(status_code=502, detail=f"Groq request failed: {e!s}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Summarization failed: {e!s}")
    return (text[:500] + "...") if len(text) > 500 else text


@app.post("/api/conversations/summarize-and-save", response_model=ConversationResponse)
def summarize_and_save_conversation(
    data: SummarizeAndSaveRequest, db: Session = Depends(get_db)
):
    person = db.query(Person).filter(Person.id == data.person_id).first()
    if not person:
        raise HTTPException(status_code=404, detail="Person not found")
    summary = _summarize_transcript(data.transcript)
    today = date.today().isoformat()
    c = Conversation(person_id=data.person_id, date=today, summary=summary)
    db.add(c)
    db.commit()
    db.refresh(c)
    return ConversationResponse(id=c.id, person_id=c.person_id, date=c.date, summary=c.summary)


# ---------- Reminders ----------
@app.get("/api/reminders", response_model=list[ReminderResponse])
def list_reminders(db: Session = Depends(get_db)):
    reminders = db.query(Reminder).order_by(Reminder.time).all()
    return [ReminderResponse(id=r.id, label=r.label, time=r.time, repeat_rule=r.repeat_rule, enabled=r.enabled) for r in reminders]


@app.post("/api/reminders", response_model=ReminderResponse)
def create_reminder(data: ReminderCreate, db: Session = Depends(get_db)):
    r = Reminder(label=data.label, time=data.time, repeat_rule=data.repeat_rule, enabled=data.enabled)
    db.add(r)
    db.commit()
    db.refresh(r)
    return ReminderResponse(id=r.id, label=r.label, time=r.time, repeat_rule=r.repeat_rule, enabled=r.enabled)


@app.patch("/api/reminders/{reminder_id}", response_model=ReminderResponse)
def update_reminder(reminder_id: int, data: ReminderUpdate, db: Session = Depends(get_db)):
    r = db.query(Reminder).filter(Reminder.id == reminder_id).first()
    if not r:
        raise HTTPException(status_code=404, detail="Reminder not found")
    if data.label is not None:
        r.label = data.label
    if data.time is not None:
        r.time = data.time
    if data.repeat_rule is not None:
        r.repeat_rule = data.repeat_rule
    if data.enabled is not None:
        r.enabled = data.enabled
    db.commit()
    db.refresh(r)
    return ReminderResponse(id=r.id, label=r.label, time=r.time, repeat_rule=r.repeat_rule, enabled=r.enabled)


@app.delete("/api/reminders/{reminder_id}")
def delete_reminder(reminder_id: int, db: Session = Depends(get_db)):
    r = db.query(Reminder).filter(Reminder.id == reminder_id).first()
    if not r:
        raise HTTPException(status_code=404, detail="Reminder not found")
    db.delete(r)
    db.commit()
    return {"ok": True}


# ---------- Emergency contacts ----------
@app.get("/api/emergency-contacts", response_model=list[EmergencyContactResponse])
def list_emergency_contacts(db: Session = Depends(get_db)):
    contacts = db.query(EmergencyContact).order_by(EmergencyContact.order_priority).all()
    return [
        EmergencyContactResponse(
            id=c.id,
            name=c.name,
            phone=c.phone,
            email=c.email,
            order_priority=c.order_priority,
            share_method=c.share_method,
        )
        for c in contacts
    ]


@app.post("/api/emergency-contacts", response_model=EmergencyContactResponse)
def create_emergency_contact(data: EmergencyContactCreate, db: Session = Depends(get_db)):
    c = EmergencyContact(
        name=data.name,
        phone=data.phone,
        email=data.email,
        order_priority=data.order_priority,
        share_method=data.share_method,
    )
    db.add(c)
    db.commit()
    db.refresh(c)
    return EmergencyContactResponse(
        id=c.id,
        name=c.name,
        phone=c.phone,
        email=c.email,
        order_priority=c.order_priority,
        share_method=c.share_method,
    )


@app.patch("/api/emergency-contacts/{contact_id}", response_model=EmergencyContactResponse)
def update_emergency_contact(contact_id: int, data: EmergencyContactUpdate, db: Session = Depends(get_db)):
    c = db.query(EmergencyContact).filter(EmergencyContact.id == contact_id).first()
    if not c:
        raise HTTPException(status_code=404, detail="Contact not found")
    if data.name is not None:
        c.name = data.name
    if data.phone is not None:
        c.phone = data.phone
    if data.email is not None:
        c.email = data.email
    if data.order_priority is not None:
        c.order_priority = data.order_priority
    if data.share_method is not None:
        c.share_method = data.share_method
    db.commit()
    db.refresh(c)
    return EmergencyContactResponse(
        id=c.id,
        name=c.name,
        phone=c.phone,
        email=c.email,
        order_priority=c.order_priority,
        share_method=c.share_method,
    )


@app.delete("/api/emergency-contacts/{contact_id}")
def delete_emergency_contact(contact_id: int, db: Session = Depends(get_db)):
    c = db.query(EmergencyContact).filter(EmergencyContact.id == contact_id).first()
    if not c:
        raise HTTPException(status_code=404, detail="Contact not found")
    db.delete(c)
    db.commit()
    return {"ok": True}


@app.get("/api/health")
def health():
    return {"status": "ok"}
