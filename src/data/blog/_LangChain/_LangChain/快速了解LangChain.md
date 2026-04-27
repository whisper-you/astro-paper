---

title: "快速了解LangChain"
author: 雨天的烟花
pubDatetime: 2026-04-27T18:00:00Z
slug: 这里填英文-slug
featured: false
draft: false
tags:

- langchain

description: "langchain quick learning"

---
# 快速了解LangChain

> **Agent + Tools + Workflow + LangGraph**

## Get Started，开始

安装相应的库

### 第一步：创建Agent（智能体）

#### **构建一个基本的智能体，A basic agent**

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

AI Agent的四大组件：

```text
Model      = 大脑
Tool       = 手脚
Prompt     = 规则人格
Invoke     = 执行动作
```

Docstring：`"""Get weather for a given city."""`这是给LLM看的工具说明，模型会读它，然后理解：

> 这是一个查询天气的工具

不能做：

- 多步骤任务规划
- 长期记忆
- 多工具链协作
- 复杂推理流程
- 状态管理

#### **Build a real-world agent**

> real-world agent:多工具 + memory + workflow

1. **Detailed system prompts** for better agent behavior **行为控制层**
   
   更强的系统提示词：从原先的"You are a helpful assistant"到而今的
   
   > 定义角色 + 行为规范 + 输出结构 + 工具使用策略
   > 
   > 你是谁 + 不能做什么 + 工具使用规则 + 输出格式 + 决策策略
   
   这样就更像一个系统
   
   本质：**控制 AI 行为的“操作系统”**
   
   - 控制风格
   - 控制是否调用 tool
   - 控制输出结构
   - 限制 hallucination

2. **Create tools** that integrate with external data**外部能力层**
   
   本质：**给 AI 接上现实世界能力**
   
   多工具相当于手，用来行动做事

3. **Model configuration** for consistent responses**稳定控制层**
   
   本质：**让 AI 稳定，而不是随机**
   
   ```python
   temperature = 0.1
   max_tokens = 2000
   timeout = 60
   ```
- 降低胡说

- 控制输出长度

- 控制一致性

- 提升生产稳定性
  
  4. **Conversational memory** for chat-like interactions**状态记忆系统**
  
  本质：**让 AI 有“状态”**
  
  > 记住你是谁 + 你刚才说了什么
  
  LangChain 里其实分：

- short-term memory（对话）

- long-term memory（用户/数据库）
  
  5. **Deep Agents** for built-in features**规划加子任务**
  
  本质：**从“单步工具调用”升级到“任务规划系统”**
  
  ```textile
  ✔ 任务拆解（planning）
  ✔ 多步骤执行
  ✔ 子 Agent（sub-agent）
  ✔ 文件系统记忆
  ✔ 长任务运行
  ```
  
  6. **Testing** your agent**工程验证**
  
  本质：**工程化验证（不是demo）**

- 是否会乱调用工具

- 是否稳定输出

- 是否 memory 正确

- 是否 long task 崩溃

- latency / cost

> ！agent是非确定性系统

必须进行测试
