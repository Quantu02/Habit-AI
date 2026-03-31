from sqlalchemy.orm import Session
from app.models import Notification

class NotificationService:
    """Service for managing notifications"""
    
    @staticmethod
    def create_notification(db: Session, user_id: int, notification_type: str, message: str):
        """Create a new notification"""
        notification = Notification(
            user_id=user_id,
            type=notification_type,
            message=message
        )
        db.add(notification)
        db.commit()
        db.refresh(notification)
        return notification
    
    @staticmethod
    def get_notifications(db: Session, user_id: int, unread_only: bool = False):
        """Get user notifications"""
        query = db.query(Notification).filter(Notification.user_id == user_id)
        
        if unread_only:
            query = query.filter(Notification.read == False)
        
        return query.order_by(Notification.created_at.desc()).all()
    
    @staticmethod
    def mark_as_read(db: Session, notification_id: int):
        """Mark notification as read"""
        notification = db.query(Notification).filter(Notification.id == notification_id).first()
        if notification:
            notification.read = True
            db.commit()
            db.refresh(notification)
        return notification
    
    @staticmethod
    def send_burnout_warning(db: Session, user_id: int, habit_name: str):
        """Send burnout warning notification"""
        message = f"⚠️ {habit_name} shows signs of burnout. Consider taking a break or reducing difficulty."
        return NotificationService.create_notification(db, user_id, "burnout_warning", message)
    
    @staticmethod
    def send_achievement(db: Session, user_id: int, achievement: str):
        """Send achievement notification"""
        message = f"🎉 Achievement unlocked: {achievement}"
        return NotificationService.create_notification(db, user_id, "achievement", message)
    
    @staticmethod
    def send_recommendation(db: Session, user_id: int, recommendation: str):
        """Send recommendation notification"""
        message = f"💡 {recommendation}"
        return NotificationService.create_notification(db, user_id, "recommendation", message)
