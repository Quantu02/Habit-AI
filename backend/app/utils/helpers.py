import json
from datetime import datetime, timedelta
from typing import Dict, List, Any

def format_date(date: datetime) -> str:
    """Format datetime to ISO string"""
    return date.isoformat() if isinstance(date, datetime) else str(date)

def get_date_range(days: int = 7):
    """Get date range for the last N days"""
    end_date = datetime.now()
    start_date = end_date - timedelta(days=days)
    return start_date, end_date

def calculate_streak(log: Dict[str, bool]) -> int:
    """
    Calculate habit streak from log
    
    Args:
        log: Dictionary with dates as keys and bool as values
        
    Returns:
        Current streak count
    """
    if not log:
        return 0
    
    sorted_dates = sorted(log.keys(), reverse=True)
    streak = 0
    current_date = datetime.now().date()
    
    for date_str in sorted_dates:
        date = datetime.fromisoformat(date_str).date()
        
        if (current_date - date).days <= 1:
            if log[date_str]:
                streak += 1
                current_date = date
            else:
                break
        else:
            break
    
    return streak

def log_habit_completion(log: Dict[str, bool], date: str, completed: bool) -> Dict[str, bool]:
    """Update habit log with completion status"""
    log[date] = completed
    return log

def get_habit_statistics(log: Dict[str, bool]) -> Dict[str, Any]:
    """Calculate statistics from habit log"""
    if not log:
        return {
            "total": 0,
            "completed": 0,
            "consistency": 0.0,
            "average_per_week": 0
        }
    
    values = list(log.values())
    total = len(values)
    completed = sum(values)
    consistency = (completed / total * 100) if total > 0 else 0
    
    # Calculate average per week (assuming log has sequential dates)
    weeks = max(1, total // 7)
    avg_per_week = completed / weeks if weeks > 0 else 0
    
    return {
        "total": total,
        "completed": completed,
        "consistency": round(consistency, 1),
        "average_per_week": round(avg_per_week, 2)
    }

def merge_dicts(dict1: Dict, dict2: Dict) -> Dict:
    """Deep merge two dictionaries"""
    result = dict1.copy()
    for key, value in dict2.items():
        if isinstance(value, dict) and key in result and isinstance(result[key], dict):
            result[key] = merge_dicts(result[key], value)
        else:
            result[key] = value
    return result

def paginate(items: List[Any], page: int = 1, per_page: int = 10) -> tuple:
    """
    Paginate a list of items
    
    Returns:
        Tuple of (paginated_items, total_pages, current_page)
    """
    total = len(items)
    total_pages = (total + per_page - 1) // per_page
    start = (page - 1) * per_page
    end = start + per_page
    
    return items[start:end], total_pages, page
