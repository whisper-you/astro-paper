---
title: "SearXNG：免费搭建搜索引擎"
author: 雨天的烟花
pubDatetime: 2026-05-11T10:42:21+08:00
slug: searxng
featured: false
draft: false
tags:
  - 搜索引擎
  - SearXNG
description: "当需要进行测试的时候，可以自建搜索引擎"
---

## Table of contents

## 🔍 SearXNG 完全指南

**SearXNG** 是一个免费、开源、隐私保护的**元搜索引擎**，可以聚合 Google、Bing、DuckDuckGo、百度等 70+ 个搜索引擎的结果，**完全免费且可自建**。

---

## 🚀 快速部署

### 方法 1：Docker（推荐）

```bash
# 创建配置文件目录
mkdir -p searxng/{config,templates}

# 下载默认配置
docker run --rm searxng/searxng:latest cat /etc/searxng/settings.yml > searxng/config/settings.yml
docker run --rm searxng/searxng:latest cat /etc/searxng/limiter.toml > searxng/config/limiter.toml

# 启动容器
docker run -d \
  --name searxng \
  -p 8080:8080 \
  -v $(pwd)/searxng/config:/etc/searxng \
  -e SEARXNG_BASE_URL="http://localhost:8080/" \
  searxng/searxng:latest
```

访问：`http://localhost:8080`

### 方法 2：Docker Compose（生产环境推荐）

```yaml
# docker-compose.yml
version: '3.8'

services:
  searxng:
    image: searxng/searxng:latest
    container_name: searxng
    ports:
      - "8080:8080"
    volumes:
      - ./config:/etc/searxng:rw
    environment:
      - SEARXNG_BASE_URL=http://localhost:8080/
      - SEARXNG_SECRET_KEY=your_secret_key_here  # 替换为随机字符串
    restart: unless-stopped
    cap_drop:
      - ALL
    cap_add:
      - CHOWN
      - SETGID
      - SETUID
    logging:
      driver: "json-file"
      options:
        max-size: "1m"
        max-file: "1"
```

启动：
```bash
docker-compose up -d
```

### 方法 3：源码安装

```bash
# 克隆仓库
git clone https://github.com/searxng/searxng.git
cd searxng

# 安装依赖
pip install -U searxng

# 运行
searxng run
```

---

## ⚙️ 配置详解

### 基础配置 (`settings.yml`)

```yaml
# /etc/searxng/settings.yml

general:
  debug: false
  instance_name: "我的 SearXNG"
  privacypolicy_url: false
  donation_url: false
  contact_url: false
  enable_metrics: true

search:
  safe_search: 0  # 0=关闭, 1=中等, 2=严格
  autocomplete: "google"  # 自动补全引擎
  default_lang: "zh-CN"
  formats:
    - html
    - json

engines:
  # 启用中文搜索引擎
  - name: 百度
    engine: baidu
    shortcut: bd
    disabled: false
    
  - name: 必应
    engine: bing
    shortcut: bi
    disabled: false
    
  - name: 谷歌
    engine: google
    shortcut: gg
    disabled: false
    
  - name: DuckDuckGo
    engine: duckduckgo
    shortcut: ddg
    disabled: false

  # 专业搜索
  - name: 维基百科
    engine: wikipedia
    shortcut: wp
    disabled: false
    
  - name: GitHub
    engine: github
    shortcut: gh
    disabled: false

server:
  secret_key: "your_secret_key"  # 必须修改！
  limiter: false  # 关闭限流（内网使用）
  image_proxy: true  # 启用图片代理
  port: 8080
  bind_address: "0.0.0.0"
  
ui:
  default_theme: simple
  default_locale: "zh-CN"
  query_in_title: true
  infinite_scroll: true
  
outgoing:
  request_timeout: 3.0
  max_request_timeout: 10.0
  useragent_suffix: "my-searxng-instance"
```

### 启用/禁用引擎

```bash
# 查看可用引擎
docker exec searxng searxng info

# 编辑配置后重启
docker restart searxng
```

---

## 🔌 API 使用

### JSON 格式搜索

```bash
# 基本搜索
curl "http://localhost:8080/search?q=AI+大模型&format=json"

# 指定引擎
curl "http://localhost:8080/search?q=python+tutorial&engines=google,github&format=json"

# 分页
curl "http://localhost:8080/search?q=machine+learning&pageno=2&format=json"
```

### Python 调用示例

```python
import requests
import json

class SearXNGClient:
    def __init__(self, base_url="http://localhost:8080"):
        self.base_url = base_url
    
    def search(self, query, engines=None, categories=None, 
               language="zh-CN", pageno=1, safesearch=0):
        """
        搜索接口
        
        Args:
            query: 搜索关键词
            engines: 指定引擎列表，如 ['google', 'bing']
            categories: 分类，如 ['general', 'images', 'news']
            language: 语言代码
            pageno: 页码
            safesearch: 安全搜索级别
        
        Returns:
            dict: 搜索结果
        """
        params = {
            'q': query,
            'format': 'json',
            'language': language,
            'pageno': pageno,
            'safesearch': safesearch
        }
        
        if engines:
            params['engines'] = ','.join(engines)
        
        if categories:
            params['categories'] = ','.join(categories)
        
        response = requests.get(f"{self.base_url}/search", params=params)
        return response.json()
    
    def get_engines(self):
        """获取可用引擎列表"""
        response = requests.get(f"{self.base_url}/engines")
        return response.json()

# 使用示例
client = SearXNGClient("http://localhost:8080")

# 基本搜索
results = client.search("2026年 AI 发展趋势", engines=['google', 'bing'])
print(f"找到 {len(results['results'])} 条结果")

for result in results['results'][:5]:
    print(f"\n📌 {result.get('title', '无标题')}")
    print(f"   🔗 {result.get('url', '无链接')}")
    print(f"   📝 {result.get('content', '无摘要')[:150]}...")
    if result.get('engine'):
        print(f"   🔍 来源: {result['engine']}")

# 搜索图片
image_results = client.search("AI 生成图片", categories=['images'])
print(f"\n找到 {len(image_results['results'])} 张图片")

# 搜索新闻
news_results = client.search("科技新闻", categories=['news'])
print(f"\n找到 {len(news_results['results'])} 条新闻")
```

### 高级搜索功能

```python
# 多引擎对比搜索
def multi_engine_search(query, engine_list):
    client = SearXNGClient()
    
    for engine in engine_list:
        print(f"\n{'='*50}")
        print(f"🔍 使用 {engine} 搜索: {query}")
        print('='*50)
        
        results = client.search(query, engines=[engine])
        
        for i, result in enumerate(results['results'][:3], 1):
            print(f"{i}. {result.get('title', '无标题')}")
            print(f"   {result.get('url', '无链接')}")
            print()

# 使用示例
multi_engine_search("大语言模型", ['google', 'bing', 'baidu', 'duckduckgo'])
```

---

## 🤖 与 AI 应用集成

### 1. 与 Chatbox 集成

创建代理服务器：

```python
# chatbox_proxy.py
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import requests
from typing import Optional

app = FastAPI(title="SearXNG Proxy for Chatbox")

# 允许跨域
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SEARXNG_URL = "http://localhost:8080"

@app.get("/search")
async def search(q: str, engines: Optional[str] = None):
    """
    Chatbox 兼容的搜索接口
    """
    try:
        params = {
            'q': q,
            'format': 'json',
            'language': 'zh-CN',
            'pageno': 1
        }
        
        if engines:
            params['engines'] = engines
        
        response = requests.get(f"{SEARXNG_URL}/search", params=params, timeout=10)
        data = response.json()
        
        # 转换为 Chatbox 期望的格式
        formatted_results = []
        for result in data.get('results', [])[:10]:
            formatted_results.append({
                "title": result.get('title', ''),
                "url": result.get('url', ''),
                "content": result.get('content', ''),
                "engine": result.get('engine', ''),
                "score": result.get('score', 0)
            })
        
        return {
            "query": data.get('query', q),
            "number_of_results": data.get('number_of_results', len(formatted_results)),
            "results": formatted_results
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    """健康检查"""
    try:
        response = requests.get(f"{SEARXNG_URL}/healthz", timeout=5)
        return {"status": "healthy", "searxng": response.status_code == 200}
    except:
        return {"status": "unhealthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

运行：
```bash
pip install fastapi uvicorn requests
python chatbox_proxy.py
```

在 Chatbox 中配置：
- 搜索 API 地址：`http://localhost:8000/search`
- 参数格式：`?q={query}`

### 2. 与 LangChain 集成

```python
# pip install langchain langchain-community
from langchain.utilities import SearxSearchWrapper
from langchain.tools import Tool

# 初始化 SearXNG
searx = SearxSearchWrapper(
    searx_host="http://localhost:8080",
    engines=["google", "bing"],
    categories=["general"],
    language="zh-CN"
)

# 创建搜索工具
search_tool = Tool(
    name="SearXNG Search",
    description="使用 SearXNG 进行联网搜索",
    func=searx.run
)

# 在 Agent 中使用
from langchain.agents import initialize_agent, AgentType
from langchain.llms import OpenAI

llm = OpenAI(temperature=0)
agent = initialize_agent(
    tools=[search_tool],
    llm=llm,
    agent=AgentType.ZERO_SHOT_REACT_DESCRIPTION,
    verbose=True
)

# 使用
result = agent.run("2026年最新的大语言模型有哪些？")
print(result)
```

### 3. 与 Open WebUI 集成

在 Open WebUI 中配置自定义搜索工具：

```python
# tools/searxng_search.py
from typing import Optional
import requests

class SearXNGSearchTool:
    def __init__(self, base_url: str = "http://localhost:8080"):
        self.base_url = base_url
    
    def search(self, query: str, num_results: int = 5) -> str:
        """
        搜索并返回格式化结果
        """
        try:
            params = {
                'q': query,
                'format': 'json',
                'language': 'zh-CN',
                'pageno': 1
            }
            
            response = requests.get(
                f"{self.base_url}/search",
                params=params,
                timeout=10
            )
            
            data = response.json()
            results = data.get('results', [])[:num_results]
            
            formatted = []
            for r in results:
                formatted.append(
                    f"标题: {r.get('title', '')}\n"
                    f"链接: {r.get('url', '')}\n"
                    f"摘要: {r.get('content', '')}\n"
                    f"来源: {r.get('engine', '')}\n"
                )
            
            return "\n---\n".join(formatted)
        
        except Exception as e:
            return f"搜索失败: {str(e)}"

# 注册工具
tool = SearXNGSearchTool()
```

---

## 🇨🇳 国内使用注意事项

### 1. 引擎可用性

国内网络环境下，部分引擎可能无法访问：

```yaml
# settings.yml - 国内推荐配置
engines:
  # ✅ 可用
  - name: 百度
    engine: baidu
    shortcut: bd
    disabled: false
    
  - name: 必应
    engine: bing
    shortcut: bi
    disabled: false
    
  - name: 搜狗
    engine: sogou
    shortcut: sg
    disabled: false
    
  # ⚠️ 可能需要代理
  - name: 谷歌
    engine: google
    shortcut: gg
    disabled: true  # 国内建议关闭
  
  - name: DuckDuckGo
    engine: duckduckgo
    shortcut: ddg
    disabled: true  # 国内建议关闭
```

### 2. 使用反向代理

```nginx
# nginx 配置
server {
    listen 80;
    server_name searxng.yourdomain.com;
    
    location / {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # 启用 HTTPS（推荐）
    listen 443 ssl;
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
}
```

### 3. 添加代理支持

```yaml
# settings.yml
outgoing:
  # 使用代理（如果需要访问国外引擎）
  proxy_url: "http://127.0.0.1:7890"  # 你的代理地址
  # 或者使用 Tor
  # using_tor_proxy: true
  
  # 自定义 User-Agent
  useragent_suffix: "SearXNG/1.0"
```

---

## ✅ 优缺点对比

### 优点
| 特性             | 说明                       |
| ---------------- | -------------------------- |
| 💰 **完全免费**   | 无需 API Key，无调用限制   |
| 🔒 **隐私保护**   | 不记录搜索历史，不追踪用户 |
| 🎛️ **高度可定制** | 可配置引擎、主题、插件     |
| 🌐 **多引擎聚合** | 支持 70+ 搜索引擎          |
| 📦 **易于部署**   | Docker 一键部署            |
| 🔌 **API 友好**   | 标准 JSON 接口，易于集成   |
| 🌍 **开源**       | GitHub 开源，社区活跃      |

### 缺点
| 问题                 | 说明               |
| -------------------- | ------------------ |
| 🐢 **速度较慢**       | 需等待多个引擎响应 |
| 🚫 **部分引擎不可用** | 国内网络限制       |
| 💻 **需自建**         | 需要服务器资源     |
| 📊 **结果质量不稳定** | 依赖底层引擎       |
| 🔧 **维护成本**       | 需定期更新和监控   |

---

## 📊 性能优化建议

### 1. 缓存配置

```yaml
# settings.yml
search:
  # 启用结果缓存
  cache_url: "redis://localhost:6379/0"
  
server:
  # 启用压缩
  gzip: true
  
outgoing:
  # 调整超时
  request_timeout: 3.0
  max_request_timeout: 10.0
```

### 2. 限流配置

```toml
# limiter.toml
[botdetection.ip_limit]
link_token = true

[botdetection.ip_lists]
block_public_ips = false
```

### 3. 使用 CDN

```nginx
# 启用缓存
proxy_cache_path /var/cache/nginx/searxng levels=1:2 keys_zone=searxng_cache:10m max_size=1g;

location / {
    proxy_cache searxng_cache;
    proxy_cache_valid 200 1h;
    proxy_cache_use_stale error timeout updating;
    proxy_pass http://localhost:8080;
}
```

---

## 🔧 故障排查

### 常见问题

```bash
# 1. 检查容器状态
docker logs searxng

# 2. 测试引擎连接
docker exec searxng searxng check-engine google

# 3. 重置配置
docker run --rm -v $(pwd)/config:/etc/searxng searxng/searxng:latest \
  sed -i 's/ultrasecretkey/$(openssl rand -hex 32)/' /etc/searxng/settings.yml

# 4. 更新版本
docker pull searxng/searxng:latest
docker restart searxng
```

---

## 📚 资源链接

- **GitHub**: https://github.com/searxng/searxng
- **文档**: https://docs.searxng.org/
- **公共实例**: https://searx.space/
- **Docker Hub**: https://hub.docker.com/r/searxng/searxng

---

## 🎯 总结

**SearXNG 适合你，如果：**
- ✅ 想要完全免费的搜索方案
- ✅ 注重隐私保护
- ✅ 有服务器资源可以自建
- ✅ 需要聚合多个搜索引擎
- ✅ 想要与 AI 应用深度集成

**不适合，如果：**
- ❌ 需要开箱即用的服务
- ❌ 对搜索速度要求极高
- ❌ 没有运维能力
- ❌ 需要稳定的商业 SLA

需要我帮你写一个**完整的部署脚本**或**特定的集成示例**吗？
