# syntax=docker/dockerfile:1
FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
  PYTHONUNBUFFERED=1 \
  PIP_NO_CACHE_DIR=1

WORKDIR /app

RUN apt-get update \
  && apt-get install -y --no-install-recommends \
  build-essential \
  default-libmysqlclient-dev \
  pkg-config \
  curl \
  && rm -rf /var/lib/apt/lists/*

COPY requirements.txt /app/requirements.txt

# Converte requirements.txt (no projeto está em UTF-16 com bytes nulos) para UTF-8
RUN python - <<'PY'
from pathlib import Path
p = Path('/app/requirements.txt')
b = p.read_bytes()
txt = None
for enc in ('utf-16', 'utf-16le', 'utf-16be'):
    try:
        txt = b.decode(enc)
        break
    except Exception:
        pass
if txt is None:
    txt = b.replace(b'\x00', b'').decode('utf-8', errors='ignore')
p.write_text(txt.replace('\r\n','\n').replace('\r','\n'), encoding='utf-8')
print('requirements.txt convertido para UTF-8')
PY

RUN pip install -r /app/requirements.txt

COPY . /app

# Copia entrypoints e garante permissão
RUN chmod +x /app/entrypoint.prod.sh /app/entrypoint.dev.sh

RUN useradd -m appuser && chown -R appuser:appuser /app
USER appuser

EXPOSE 8000
