"""SQLAlchemy models for Remember Me MVP."""
from sqlalchemy import Column, Integer, String, Float, Boolean, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base


class Person(Base):
    __tablename__ = "people"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    relationship = Column(String(255), nullable=False)
    about = Column(Text, nullable=True)
    photo_base64 = Column(Text, nullable=True)  # base64 image for display
    face_descriptor = Column(Text, nullable=True)  # JSON array of 128 floats for recognition
    with_you_today = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Conversation(Base):
    __tablename__ = "conversations"

    id = Column(Integer, primary_key=True, index=True)
    person_id = Column(Integer, ForeignKey("people.id", ondelete="CASCADE"), nullable=False)
    date = Column(String(20), nullable=False)  # YYYY-MM-DD
    summary = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    person = relationship("Person", backref="conversations")


class Reminder(Base):
    __tablename__ = "reminders"

    id = Column(Integer, primary_key=True, index=True)
    label = Column(String(255), nullable=False)
    time = Column(String(10), nullable=False)  # HH:MM
    repeat_rule = Column(String(50), default="daily")  # daily, weekdays, once
    enabled = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class EmergencyContact(Base):
    __tablename__ = "emergency_contacts"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    phone = Column(String(50), nullable=False)
    email = Column(String(255), nullable=True)
    order_priority = Column(Integer, default=0)
    share_method = Column(String(20), default="sms")  # sms, email
    created_at = Column(DateTime(timezone=True), server_default=func.now())
