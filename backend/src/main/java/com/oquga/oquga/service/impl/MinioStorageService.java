package com.oquga.oquga.service.impl;

import com.oquga.oquga.service.StorageService;
import io.minio.*;
import io.minio.http.Method;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.io.FilenameUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
@Slf4j
public class MinioStorageService implements StorageService {

    private final MinioClient minioClient;

    @Value("${s3.bucket-name}")
    private String bucketName;

    @Value("${s3.public-url:}")
    private String publicUrl;

    @PostConstruct
    public void init() {
        createBucketIfNotExists();
        setBucketPublicReadPolicy();
    }

    @Override
    public String upload(MultipartFile file, String folder) {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("Cannot upload empty file");
        }

        String extension = FilenameUtils.getExtension(file.getOriginalFilename());
        String safeFileName = UUID.randomUUID() + (extension != null ? "." + extension : "");

        String objectName = (folder + "/" + safeFileName).replaceAll("//+", "/");

        String contentType = file.getContentType();
        if (contentType == null) {
            contentType = "application/octet-stream";
        }

        try (InputStream inputStream = file.getInputStream()) {
            minioClient.putObject(
                    PutObjectArgs.builder()
                            .bucket(bucketName)
                            .object(objectName)
                            .stream(inputStream, file.getSize(), -1)
                            .contentType(contentType)
                            .build()
            );
        } catch (Exception e) {
            log.error("Failed to upload file to MinIO: {}", objectName, e);
            throw new RuntimeException("Failed to upload file", e);
        }

        log.info("File uploaded to MinIO: {}", objectName);
        return objectName;
    }

    @Override
    public void delete(String objectName) {
        if (objectName == null || objectName.isBlank()) return;

        try {
            minioClient.removeObject(
                    RemoveObjectArgs.builder()
                            .bucket(bucketName)
                            .object(objectName)
                            .build()
            );
            log.info("File removed from MinIO: {}", objectName);
        } catch (Exception e) {
            log.error("Failed to delete file from MinIO: {}", objectName, e);
        }
    }

    @Override
    public String getFileUrl(String objectName) {
        if (objectName == null || objectName.isBlank()) return null;

        if (publicUrl != null && !publicUrl.isBlank()) {
            String cleanPublicUrl = publicUrl.replaceAll("/+$", "");
            return cleanPublicUrl + "/" + bucketName + "/" + objectName;
        }

        try {
            return minioClient.getPresignedObjectUrl(
                    GetPresignedObjectUrlArgs.builder()
                            .method(Method.GET)
                            .bucket(bucketName)
                            .object(objectName)
                            .expiry(2, TimeUnit.HOURS)
                            .build()
            );
        } catch (Exception e) {
            log.error("Failed to generate presigned URL for: {}", objectName, e);
            return null;
        }
    }

    @Override
    public InputStream getFile(String objectName) {
        try {
            return minioClient.getObject(
                    GetObjectArgs.builder()
                            .bucket(bucketName)
                            .object(objectName)
                            .build()
            );
        } catch (Exception e) {
            log.error("Failed to get file from MinIO: {}", objectName, e);
            throw new RuntimeException("Failed to get file", e);
        }
    }

    private void createBucketIfNotExists() {
        try {
            boolean found = minioClient.bucketExists(BucketExistsArgs.builder().bucket(bucketName).build());
            if (!found) {
                minioClient.makeBucket(MakeBucketArgs.builder().bucket(bucketName).build());
                log.info("Bucket '{}' created.", bucketName);
            }
        } catch (Exception e) {
            log.error("Failed to create bucket: {}", bucketName, e);
        }
    }

    private void setBucketPublicReadPolicy() {
        try {
            String policy = """
                {
                    "Version": "2012-10-17",
                    "Statement": [
                        {
                            "Effect": "Allow",
                            "Principal": {"AWS": ["*"]},
                            "Action": ["s3:GetObject"],
                            "Resource": ["arn:aws:s3:::%s/*"]
                        }
                    ]
                }
                """.formatted(bucketName);

            minioClient.setBucketPolicy(
                    SetBucketPolicyArgs.builder()
                            .bucket(bucketName)
                            .config(policy)
                            .build()
            );
            log.info("Public read policy set for bucket: {}", bucketName);
        } catch (Exception e) {
            log.warn("Failed to set bucket policy (may already exist): {}", e.getMessage());
        }
    }
}
