package com.fis.backend.controller;

import com.fis.backend.services.ProcessService;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/process")
@RequiredArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE, makeFinal = true)
public class ProcessController {
    ProcessService processService;

    @PostMapping("/start")
    public String startProcess() {
        return processService.startProcess();
    }
}
