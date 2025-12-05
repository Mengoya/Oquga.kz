package com.oquga.oquga.service;

import org.springframework.web.multipart.MultipartFile;
import java.io.InputStream;

public interface StorageService {

    /**
     * Загружает файл в хранилище.
     * @param file файл из запроса
     * @param folder название папки (например, "universities/logos")
     * @return относительный путь к файлу (ключ объекта)
     */
    String upload(MultipartFile file, String folder);

    /**
     * Удаляет файл из хранилища.
     * @param objectName ключ объекта (путь)
     */
    void delete(String objectName);

    /**
     * Получает прямую ссылку на скачивание (presigned url) или публичный URL.
     * @param objectName ключ объекта
     * @return URL в строковом виде
     */
    String getFileUrl(String objectName);

    /**
     * Получает поток данных файла (для проксирования через бэкенд, если нужно).
     */
    InputStream getFile(String objectName);
}