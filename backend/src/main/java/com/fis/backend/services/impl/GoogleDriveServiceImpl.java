package com.fis.backend.services.impl;

import com.fis.backend.services.GoogleDriveService;
import com.fis.backend.utils.enums.FolderType;
import com.google.api.client.http.FileContent;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.jackson2.JacksonFactory;
import com.google.api.services.drive.Drive;
import com.google.api.services.drive.DriveScopes;
import com.google.api.services.drive.model.File;
import com.google.auth.http.HttpCredentialsAdapter;
import com.google.auth.oauth2.GoogleCredentials;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Collections;

@Service
public class GoogleDriveServiceImpl implements GoogleDriveService {
    @Value("${service.google.drive.application-name}")
    private String APPLICATION_NAME;
    @Value("${service.google.drive.root-folder-id}")
    private String ROOT_FOLDER_ID;
    @Value("${service.google.drive.avatar-folder-id}")
    private String AVATAR_FOLDER_ID;
    @Value("${service.google.drive.product-folder-id}")
    private String PRODUCT_FOLDER_ID;

    private Drive getDriveService() throws IOException {
        // Load credentials from JSON file
        GoogleCredentials credentials = GoogleCredentials.fromStream(
                        getClass().getResourceAsStream("/credentials.json"))
                .createScoped(Collections.singleton(DriveScopes.DRIVE_FILE));
        return new Drive.Builder(new NetHttpTransport(),
                JacksonFactory.getDefaultInstance(),
                new HttpCredentialsAdapter(credentials))
                .setApplicationName(APPLICATION_NAME)
                .build();
    }

    private String uploadImageToDrive(MultipartFile file, String folderId) throws IOException {
        Drive driveService = getDriveService();

        // Create a temporary file from MultipartFile
        java.io.File tempFile = java.io.File.createTempFile("temp", null);
        file.transferTo(tempFile);

        // Set metadata for the file
        File fileMetadata = new File();
        fileMetadata.setName(file.getOriginalFilename());
        fileMetadata.setParents(Collections.singletonList(folderId));

        // Create FileContent and upload to Drive
        FileContent mediaContent = new FileContent(file.getContentType(), tempFile);
        File uploadedFile = driveService.files().create(fileMetadata, mediaContent)
                .setFields("id,webContentLink,webViewLink")
                .execute();

        // Clean up temporary file
        tempFile.delete();

        // Return the URL to access the file
        return uploadedFile.getWebViewLink();
    }

    @Override
    public String uploadImageToDrive(MultipartFile file) throws IOException {
        return uploadImageToDrive(file, ROOT_FOLDER_ID);
    }

    @Override
    public String uploadImageToDrive(MultipartFile file, FolderType type) throws IOException {
        return uploadImageToDrive(file, switch (type) {
            case AVATAR -> AVATAR_FOLDER_ID;
            case PRODUCT -> PRODUCT_FOLDER_ID;
        });
    }

}
