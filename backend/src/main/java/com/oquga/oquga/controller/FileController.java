package com.oquga.oquga.controller;

import com.oquga.oquga.service.StorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/files")
@RequiredArgsConstructor
public class FileController {

    private final StorageService storageService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, String>> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "folder", defaultValue = "common") String folder
    ) {
        String objectKey = storageService.upload(file, folder);
        String url = storageService.getFileUrl(objectKey);

        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                "key", objectKey,
                "url", url
        ));
    }

    // Получение временной ссылки на файл по ключу
    @GetMapping("/url")
    public ResponseEntity<Map<String, String>> getFileUrl(@RequestParam("key") String key) {
        return ResponseEntity.ok(Map.of("url", storageService.getFileUrl(key)));
    }

    // Прямое скачивание файла через бэкенд (если MinIO закрыт снаружи фаерволом)
    @GetMapping("/download")
    public ResponseEntity<InputStreamResource> downloadFile(@RequestParam("key") String key) {
        InputStreamResource resource = new InputStreamResource(storageService.getFile(key));

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + key + "\"")
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(resource);
    }
}