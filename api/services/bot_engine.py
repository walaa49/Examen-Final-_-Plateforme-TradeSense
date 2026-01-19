from datetime import datetime
import random

# Mock Global State
LATEST_TICKET = {
    "timestamp": None,
    "symbol": "XAUUSD",
    "signal_type": "WAITING", 
    "entry_price": 0.0,
    "sl": 0.0,
    "tp": 0.0,
    "confidence": 0.0,
    "status": "WAITING"
}

def generate_signal():
    """
    Simulates the AI generation of a trading signal.
    This function is stateless (mostly) and suited for Serverless execution.
    """
    global LATEST_TICKET
    
    price = 2030.0 + random.uniform(-10, 10)
    is_long = random.choice([True, False])
    
    new_ticket = {
        "timestamp": datetime.now().isoformat(),
        "symbol": "XAUUSD",
        "signal_type": "LONG" if is_long else "SHORT",
        "entry_price": round(price, 2),
        "sl": round(price - 5 if is_long else price + 5, 2),
        "tp": round(price + 10 if is_long else price - 10, 2),
        "confidence": round(random.uniform(70, 95), 2),
        "status": "SIGNAL_GENERATED"
    }
    
    LATEST_TICKET = new_ticket
    return new_ticket
