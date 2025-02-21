package com.fis.backend.services.impl;

import com.fis.backend.dto.ApiResponse;
import com.fis.backend.services.ProcessService;
import com.fis.backend.utils.Constants;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.camunda.bpm.engine.RuntimeService;
import org.camunda.bpm.engine.runtime.ProcessInstance;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE, makeFinal = true)
public class ProcessServiceImpl implements ProcessService {
    RuntimeService runtimeService;

    @Override
    public String startProcess() {
        ProcessInstance processInstance = runtimeService
                .startProcessInstanceByKey(Constants.START_PROCESS, UUID.randomUUID().toString());
        return processInstance.getId();
    }
}
