package com.voting.Gp3.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Base64;
import java.util.UUID;

import org.springframework.stereotype.Service;

@Service
public class ImageStorageService {

    private final Path imageStorageDirectory;

    public ImageStorageService() {
        this(Path.of("candidates_images"));
    }

    public ImageStorageService(Path imageStorageDirectory) {
        this.imageStorageDirectory = imageStorageDirectory;
        try {
            Files.createDirectories(this.imageStorageDirectory);
        } catch (IOException e) {
            throw new IllegalStateException("Unable to initialize image storage directory", e);
        }
    }

    public String storeImageFromDataUrl(String dataUrl) {
        if (dataUrl == null || dataUrl.isBlank() || !dataUrl.startsWith("data:image/")) {
            return dataUrl;
        }

        String[] parts = dataUrl.split(",", 2);
        String metadata = parts[0];
        String imageData = parts.length > 1 ? parts[1] : "";

        String extension = ".jpg";
        if (metadata.contains("image/png")) {
            extension = ".png";
        } else if (metadata.contains("image/jpeg") || metadata.contains("image/jpg")) {
            extension = ".jpg";
        } else if (metadata.contains("image/gif")) {
            extension = ".gif";
        } else if (metadata.contains("image/webp")) {
            extension = ".webp";
        } else if (metadata.contains("image/bmp")) {
            extension = ".bmp";
        } else if (metadata.contains("image/svg+xml")) {
            extension = ".svg";
        }

        byte[] decodedBytes = Base64.getDecoder().decode(imageData);
        String uniqueFileName = UUID.randomUUID() + extension;
        Path targetPath = imageStorageDirectory.resolve(uniqueFileName);

        try {
            Files.write(targetPath, decodedBytes);
            return "candidates_images/" + uniqueFileName;
        } catch (IOException e) {
            throw new IllegalStateException("Failed to save image file", e);
        }
    }

    public void deleteImage(String imagePath) {
        if (imagePath == null || imagePath.isBlank() || imagePath.startsWith("http") || imagePath.startsWith("data:")) {
            return;
        }

        String relativePath = imagePath.replaceFirst("^/?candidates_images/", "");
        Path filePath = imageStorageDirectory.resolve(relativePath).normalize();

        try {
            if (filePath.startsWith(imageStorageDirectory)) {
                Files.deleteIfExists(filePath);
            }
        } catch (IOException e) {
            throw new IllegalStateException("Failed to delete image file", e);
        }
    }
}
