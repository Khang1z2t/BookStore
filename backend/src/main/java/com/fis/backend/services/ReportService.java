package com.fis.backend.services;

import com.fis.backend.entity.User;
import net.sf.jasperreports.engine.JRException;

import java.io.FileNotFoundException;
import java.util.List;

public interface ReportService {
    byte[] exportUserReportPdf(List<User> users) throws JRException, FileNotFoundException;

    byte[] exportUserReportExcel(List<User> users) throws JRException, FileNotFoundException;

}
