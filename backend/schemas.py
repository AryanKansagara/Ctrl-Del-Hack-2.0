"""Pydantic schemas for Remember Me MVP."""
from pydantic import BaseModel, Field
from typing import Optional, List


class PersonBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    relationship: str = Field(..., min_length=1, max_length=255)
    about: Optional[str] = None


class PersonCreate(PersonBase):
    photo_base64: Optional[str] = None
    face_descriptor: Optional[List[float]] = None  # 128 floats
    with_you_today: bool = False


class PersonUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    relationship: Optional[str] = Field(None, min_length=1, max_length=255)
    about: Optional[str] = None
    photo_base64: Optional[str] = None
    face_descriptor: Optional[List[float]] = None
    with_you_today: Optional[bool] = None


class PersonResponse(PersonBase):
    id: int
    photo_base64: Optional[str] = None
    face_descriptor: Optional[List[float]] = None
    with_you_today: bool = False

    class Config:
        from_attributes = True


class PersonForRecognition(BaseModel):
    """Minimal person data for recognition (name, relationship, descriptor)."""
    id: int
    name: str
    relationship: str
    face_descriptor: Optional[List[float]] = None

    class Config:
        from_attributes = True


class ConversationBase(BaseModel):
    date: str = Field(..., pattern=r"^\d{4}-\d{2}-\d{2}$")
    summary: str = Field(..., min_length=1)


class ConversationCreate(ConversationBase):
    person_id: int


class ConversationResponse(ConversationBase):
    id: int
    person_id: int

    class Config:
        from_attributes = True


class SummarizeAndSaveRequest(BaseModel):
    person_id: int
    transcript: str = ""  # raw speech-to-text; can be long, backend will trim


class ReminderBase(BaseModel):
    label: str = Field(..., min_length=1, max_length=255)
    time: str = Field(..., pattern=r"^\d{1,2}:\d{2}$")  # H:MM or HH:MM
    repeat_rule: str = "daily"
    enabled: bool = True


class ReminderCreate(ReminderBase):
    pass


class ReminderUpdate(BaseModel):
    label: Optional[str] = Field(None, min_length=1, max_length=255)
    time: Optional[str] = Field(None, pattern=r"^\d{1,2}:\d{2}$")
    repeat_rule: Optional[str] = None
    enabled: Optional[bool] = None


class ReminderResponse(ReminderBase):
    id: int

    class Config:
        from_attributes = True


class EmergencyContactBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    phone: str = Field(..., min_length=1, max_length=50)
    email: Optional[str] = None
    order_priority: int = 0
    share_method: str = "sms"


class EmergencyContactCreate(EmergencyContactBase):
    pass


class EmergencyContactUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    phone: Optional[str] = Field(None, min_length=1, max_length=50)
    email: Optional[str] = None
    order_priority: Optional[int] = None
    share_method: Optional[str] = None


class EmergencyContactResponse(EmergencyContactBase):
    id: int

    class Config:
        from_attributes = True
