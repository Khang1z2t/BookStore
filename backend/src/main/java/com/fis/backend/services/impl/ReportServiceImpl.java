package com.fis.backend.services.impl;

import com.fis.backend.dto.UserDetailReportDTO;
import com.fis.backend.entity.User;
import com.fis.backend.mapper.UserMapper;
import com.fis.backend.repository.UserRepository;
import com.fis.backend.services.ReportService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import net.sf.jasperreports.engine.*;
import net.sf.jasperreports.engine.data.JRBeanCollectionDataSource;
import net.sf.jasperreports.engine.export.ooxml.JRXlsxExporter;
import net.sf.jasperreports.export.SimpleExporterInput;
import net.sf.jasperreports.export.SimpleOutputStreamExporterOutput;
import net.sf.jasperreports.export.SimpleXlsxReportConfiguration;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.FileNotFoundException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Slf4j
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ReportServiceImpl implements ReportService {
    UserRepository userRepository;
    UserMapper userMapper;


    @Override
    public byte[] exportUserReportPdf(List<User> users) throws JRException, FileNotFoundException {
        try {
            List<UserDetailReportDTO> userDetailReportDTOS = users.stream()
                    .map(userMapper::toUserDetailReportDTO)
                    .toList();
            JasperPrint jasperPrint = getJasperPrint(userDetailReportDTOS, "reports/account_report.jrxml");
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            JasperExportManager.exportReportToPdfStream(jasperPrint, outputStream);

            return outputStream.toByteArray();
        } catch (JRException e) {
            log.error("JRException: " + e.getMessage(), e);
            throw e;
        } catch (FileNotFoundException e) {
            log.error("FileNotFoundException: " + e.getMessage(), e);
            throw e;
        } catch (Exception e) {
            log.error("Exception: " + e.getMessage(), e);
            throw new UnsupportedOperationException("An unexpected error occurred", e);
        }
    }

    @Override
    public byte[] exportUserReportExcel(List<User> users) throws JRException, FileNotFoundException {
        try {
            List<UserDetailReportDTO> userDetailReportDTOS = users.stream()
                    .map(userMapper::toUserDetailReportDTO)
                    .toList();
            JasperPrint jasperPrint = getJasperPrint(userDetailReportDTOS, "reports/account_report.jrxml");

            // Xuất báo cáo sang Excel
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            JRXlsxExporter exporter = new JRXlsxExporter();
            exporter.setExporterInput(new SimpleExporterInput(jasperPrint));
            exporter.setExporterOutput(new SimpleOutputStreamExporterOutput(outputStream));

            // Cấu hình xuất Excel (tùy chọn)
            SimpleXlsxReportConfiguration configuration = new SimpleXlsxReportConfiguration();
            configuration.setOnePagePerSheet(false); // Cho phép nhiều trang trên một sheet
            configuration.setRemoveEmptySpaceBetweenRows(true); // Loại bỏ khoảng trắng thừa
            exporter.setConfiguration(configuration);
            exporter.exportReport();

            return outputStream.toByteArray();
        } catch (JRException e) {
            System.out.println("JRException: " + e.getMessage());
            throw e;
        } catch (FileNotFoundException e) {
            System.out.println("FileNotFoundException: " + e.getMessage());
            throw e;
        } catch (Exception e) {
            throw e;
        }
    }

    private <T> JasperPrint getJasperPrint(List<T> data, String resourseFile) throws JRException, FileNotFoundException {
        InputStream reportStream = getClass().getClassLoader().getResourceAsStream(resourseFile);
        if (reportStream == null) {
            throw new FileNotFoundException("Jasper report file not found in classpath");
        }
        JasperReport jasperReport = JasperCompileManager.compileReport(reportStream);
        JRBeanCollectionDataSource dataSource = new JRBeanCollectionDataSource(data);
        Map<String, Object> parameters = new HashMap<>();
        parameters.put("createdBy", "Yuno.k");
        return JasperFillManager.fillReport(jasperReport, parameters, dataSource);
    }
}
