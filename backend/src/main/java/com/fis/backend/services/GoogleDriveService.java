package com.fis.backend.services;

import com.fis.backend.utils.enums.FolderType;
import com.google.api.client.http.FileContent;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.jackson2.JacksonFactory;
import com.google.api.services.drive.Drive;
import com.google.api.services.drive.DriveScopes;
import com.google.api.services.drive.model.File;
import com.google.auth.http.HttpCredentialsAdapter;
import com.google.auth.oauth2.GoogleCredentials;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Collections;


public interface GoogleDriveService {
    String uploadImageToDrive(MultipartFile file) throws IOException;

    String uploadImageToDrive(MultipartFile file, FolderType type) throws IOException;


}
