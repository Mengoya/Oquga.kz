FROM gradle:8.8-jdk21-jammy AS builder

WORKDIR /app

COPY build.gradle.kts settings.gradle.kts ./
COPY gradle ./gradle

RUN gradle dependencies --no-daemon

COPY src ./src

RUN gradle bootJar --no-daemon -x test

FROM eclipse-temurin:21-jre-jammy

WORKDIR /app

RUN groupadd --system --gid 1001 appgroup && \
    useradd --system --uid 1001 --gid appgroup appuser

COPY --from=builder --chown=appuser:appgroup /app/build/libs/*.jar app.jar

RUN mkdir logs && chown appuser:appgroup logs

USER appuser

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]