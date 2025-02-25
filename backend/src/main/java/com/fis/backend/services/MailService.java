package com.fis.backend.services;

public interface MailService {
    void sendEmail(String to, String subject, String body);
}
