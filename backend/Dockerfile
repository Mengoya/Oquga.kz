FROM maven:3.9.6-eclipse-temurin-21 AS builder

WORKDIR /app

COPY pom.xml .

RUN mvn dependency:go-offline

COPY src ./src

RUN mvn clean package -DskipTests

FROM eclipse-temurin:21-jre-jammy

WORKDIR /app

RUN groupadd --system --gid 1001 appgroup && \
    useradd --system --uid 1001 --gid appgroup appuser

COPY --from=builder --chown=appuser:appgroup /app/target/*.jar app.jar

RUN mkdir logs && chown appuser:appgroup logs

USER appuser

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]