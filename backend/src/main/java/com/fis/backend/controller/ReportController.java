package com.fis.backend.controller;

import com.fis.backend.dto.ApiResponse;
import com.fis.backend.entity.User;
import com.fis.backend.repository.UserRepository;
import com.fis.backend.services.ReportService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import net.sf.jasperreports.engine.JRException;
import net.sf.jasperreports.engine.JasperExportManager;
import net.sf.jasperreports.engine.JasperPrint;
import net.sf.jasperreports.engine.export.HtmlExporter;
import net.sf.jasperreports.export.SimpleExporterInput;
import net.sf.jasperreports.export.SimpleHtmlExporterOutput;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.ByteArrayOutputStream;
import java.io.FileNotFoundException;
import java.util.List;

@RestController
@RequestMapping("/api/v1/report")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ReportController {
    UserRepository userRepository;
    ReportService reportService;

    @GetMapping("/user/export-pdf")
    ResponseEntity<byte[]> exportUserReportPdf(){
        try {
            List<User> users = userRepository.findAll();
            byte[] pdfContent = reportService.exportUserReportPdf(users);
            HttpHeaders headers = new HttpHeaders();
            headers.add("Content-Disposition", "inline; filename=report.pdf");
            headers.setContentType(MediaType.APPLICATION_PDF);
            return ResponseEntity.ok()
                    .headers(headers)
                    .body(pdfContent);
        } catch (FileNotFoundException | JRException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new byte[0]);
        }
    }

    @GetMapping("/user/export-excel")
    ResponseEntity<byte[]> exportUserReportExcel(){
        try {
            List<User> users = userRepository.findAll();
            byte[] excelContent = reportService.exportUserReportExcel(users);
            HttpHeaders headers = new HttpHeaders();
            headers.add("Content-Disposition", "inline; filename=report.xlsx");
            headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
            return ResponseEntity.ok()
                    .headers(headers)
                    .body(excelContent);
        } catch (FileNotFoundException | JRException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new byte[0]);
        }
    }
}
