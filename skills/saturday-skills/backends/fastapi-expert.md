# FastAPI Expert SKILL

## When to Use This Skill
Use when building Python backends with FastAPI, especially for async APIs and ML services.

## Core Knowledge

### Async Patterns
```python
from fastapi import FastAPI
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker

app = FastAPI()

# Async database session
engine = create_async_engine("postgresql+asyncpg://user:pass@localhost/db")
async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

async def get_db():
    async with async_session() as session:
        yield session

@app.get("/items")
async def list_items(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Item))
    return result.scalars().all()
```

### Pydantic Models
```python
from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime

class UserCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=8)

class UserResponse(BaseModel):
    id: str
    name: str
    email: str
    created_at: datetime
    
    class Config:
        from_attributes = True  # ORM mode
```

### Background Tasks
```python
from fastapi import BackgroundTasks

def send_email(email: str, message: str):
    # Send email logic
    pass

@app.post("/register")
async def register(user: UserCreate, background: BackgroundTasks):
    # Create user in DB
    background.add_task(send_email, user.email, "Welcome!")
    return {"status": "ok"}
```

### WebSockets
```python
from fastapi import WebSocket

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    while True:
        data = await websocket.receive_text()
        await websocket.send_text(f"Echo: {data}")
```

### VPS Deployment
```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: "fastapi",
    script: "uvicorn",
    args: "main:app --host 0.0.0.0 --port 8000",
    interpreter: "python3",
    max_memory_restart: "200M",
    env: { NODE_ENV: "production" }
  }]
};
```

## Common Pitfalls
1. **Blocking code in async** — Use `run_in_executor` for CPU-bound tasks
2. **Not using async DB** — Use `asyncpg` + `sqlalchemy[asyncio]`
3. **Missing CORS** — Add `CORSMiddleware` for frontend access
4. **No input validation** — Always use Pydantic models

## Verification Checklist
- [ ] `uvicorn main:app --reload` runs locally
- [ ] All endpoints have Pydantic models
- [ ] Database sessions are async
- [ ] CORS configured for frontend
- [ ] PM2 process running on VPS
