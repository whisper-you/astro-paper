---

title: "小知识点"
author: 雨天的烟花
pubDatetime: 2026-04-27T18:00:00Z
slug: lingsui-01
featured: false
draft: false
tags:

- python

description: "待定"

---
```python
from langchain.agents import create_agent

def get_weather(city: str) -> str:
    """Get weather for a given city."""
    return f"It's always sunny in {city}!"

agent = create_agent(
    model="google_genai:gemini-2.5-flash-lite",
    tools=[get_weather],
    system_prompt="You are a helpful assistant",
)

result = agent.invoke(
    {"messages": [{"role": "user", "content": "What's the weather in San Francisco?"}]}
)

print(result["messages"][-1].content_blocks)
```

`->`：
