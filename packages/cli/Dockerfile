FROM alpine AS base

ARG BUN_RUNTIME_TRANSPILER_CACHE_PATH=0
ENV BUN_RUNTIME_TRANSPILER_CACHE_PATH=${BUN_RUNTIME_TRANSPILER_CACHE_PATH}
RUN apk add --no-cache libgcc libstdc++ ripgrep

FROM base AS build-amd64
COPY dist/cli-linux-x64-baseline-musl/bin/ucode /usr/local/bin/ucode

FROM base AS build-arm64
COPY dist/cli-linux-arm64-musl/bin/ucode /usr/local/bin/ucode

ARG TARGETARCH
FROM build-${TARGETARCH}
LABEL org.opencontainers.image.title="U Code" \
      org.opencontainers.image.description="U Code, the Uhuru coding agent." \
      org.opencontainers.image.vendor="OrionX" \
      org.opencontainers.image.url="https://code.uhuruai.co" \
      org.opencontainers.image.source="https://github.com/monti212/Code-agent"
RUN ucode --version
ENTRYPOINT ["ucode"]
