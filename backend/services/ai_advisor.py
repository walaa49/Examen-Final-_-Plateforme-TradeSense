"""
AI Trading Advisor Service

Uses LLM leverage to analyze market conditions and provide trading biases.
"""
import os
import json
import random
from datetime import datetime

# You would ideally use the OpenAI SDK or similar here
# from openai import OpenAI

SYSTEM_PROMPT = """
You are an advanced AI Trading Decision Assistant.

Your role is NOT to execute trades, but to HELP ME make accurate, disciplined, and data-driven trading decisions.
"""

def get_ai_analysis(symbol, timeframe, price_data, news_headlines=None):
    """
    Generates an AI trading analysis for the given symbol.
    """
    api_key = os.getenv('OPENAI_API_KEY')
    
    # Call LLM API (Mock implementation if no key)
    if not api_key:
        return _generate_mock_analysis(symbol, price_data)
        
    try:
        # Placeholder for actual API call
        return _generate_mock_analysis(symbol, price_data) # Fallback for now
    except Exception as e:
        print(f"AI Analysis failed: {str(e)}")
        return _generate_mock_analysis(symbol, price_data)

def get_ai_chat_response(message, context=None):
    """
    Generates a chat response from the AI.
    """
    target = message.lower()
    
    # Simple Mock Responses for Demo
    if "hello" in target or "hi" in target:
        return "Hello! I am your Trading Assistant. How can I help you analyze the markets today?"
    
    if "buy" in target or "long" in target:
        return "Before going long, ensure you have confirmation from RSI and that price is above the key Support zone. What timeframe are you looking at?"
        
    if "sell" in target or "short" in target:
        return "Shorting requires patience. Check if we are breaking below the local trendline. Have you checked the volume?"
        
    if "btc" in target or "bitcoin" in target:
        return "Bitcoin is showing interesting volatility. Currently, I'm watching the $95k level closely. It acts as a major psychological barrier."
        
    if "trend" in target:
        return "The overall trend on higher timeframes (4H/Daily) is currently Bullish, but watch out for lower timeframe pullbacks."
        
    return f"I understand you're asking about '{message}'. As an AI, I recommend checking the latest news and technical indicators for confirmation."

def _generate_mock_analysis(symbol, price_data):
    """
    Generates a deterministic mock response based on price data.
    """
    price = price_data.get('price', 100)
    change = price_data.get('change_pct', 0)
    
    if change > 1.5:
        bias = "BULLISH"
        rec = "BUY"
        reason = "Strong upward momentum confirmed by price action."
        target = f"{price * 1.05:.2f}"
        stop = f"{price * 0.98:.2f}"
    elif change < -1.5:
        bias = "BEARISH"
        rec = "SELL"
        reason = "Significant selling pressure observed."
        target = f"{price * 0.95:.2f}"
        stop = f"{price * 1.02:.2f}"
    else:
        bias = "NEUTRAL"
        rec = "WAIT"
        reason = "Market is consolidating. No clear trend direction."
        target = "Wait for breakout"
        stop = "N/A"
        
    return {
        "market_bias": bias,
        "news_impact": "Neutral - No major catalysts identified.",
        "technical_setup": f"Price is {bias.lower()}. Volatility is {'high' if abs(change) > 2 else 'moderate'}.",
        "best_scenario": f"{bias} continuation towards targets.",
        "recommendation": rec,
        "entry_zone": f"{price}",
        "invalidation_level": stop,
        "target_zone": target,
        "risk_level": "MEDIUM",
        "confidence_score": 75 if abs(change) > 1 else 45,
        "reasoning": reason
    }
