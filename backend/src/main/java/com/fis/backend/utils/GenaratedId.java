package com.fis.backend.utils;

import org.springframework.stereotype.Component;

import java.util.Random;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Component
public class GenaratedId {
    public String createNewID(String chars) {
        return chars + String.format("%03d", 1);
    }

    public String createIDFromLastID(String chars, Integer index, String lastID) {
        Integer IDNumber = Integer.parseInt(lastID.substring(index));
        IDNumber++;
        return chars + String.format("%03d", IDNumber);
    }
    public  String generateRandomID() {
        Random random = new Random();
        StringBuilder sb = new StringBuilder();

        // Tạo 15 số ngẫu nhiên
        for (int i = 0; i < 15; i++) {
            sb.append(random.nextInt(10)); // Số từ 0-9
        }

        return sb.toString();
    }

    public String maskName(String name) {
        if (name == null || name.length() < 2) {
            return name; // Nếu tên quá ngắn, giữ nguyên
        }

        // Lấy chữ cái đầu và cuối
        char firstChar = name.charAt(0);
        char lastChar = name.charAt(name.length() - 1);

        // Tạo phần giữa thành ***
        String maskedPart = "*".repeat(name.length() - 2);

        return firstChar + maskedPart + lastChar;
    }

    public String getIdImage(String url) {
        Pattern pattern = Pattern.compile("/d/([^/]+)");
        Matcher matcher = pattern.matcher(url);
        if (matcher.find()) {
            return matcher.group(1);
        }
        return url;
    }

}
