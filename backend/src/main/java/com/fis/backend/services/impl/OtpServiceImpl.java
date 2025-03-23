package com.fis.backend.services.impl;


import com.fis.backend.entity.Otp;
import com.fis.backend.entity.User;
import com.fis.backend.exception.AppException;
import com.fis.backend.exception.ErrorCode;
import com.fis.backend.repository.OtpRepository;
import com.fis.backend.repository.UserRepository;
import com.fis.backend.services.OtpService;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Optional;
import java.util.Random;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE, makeFinal = true)
public class OtpServiceImpl implements OtpService {
    OtpRepository otpRepository;
    UserRepository userRepository;

    @Override
    @Transactional
    public String generateOtp(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        otpRepository.deleteByEmail(user.getEmail());

        String otp = String.format("%06d", new Random().nextInt(999999));
        Otp otpEntity = new Otp();
        otpEntity.setEmail(user.getEmail());
        otpEntity.setOtpCode(otp);
        otpEntity.setExpiresAt(Instant.now().plusSeconds(60 * 30));
        otpRepository.save(otpEntity);
        return otp;
    }

    @Override
    public boolean verifyOtp(String email, String otp) {
        Optional<Otp> otpOptional = otpRepository.findByEmailAndExpiresAtAfter(email, Instant.now());

        if (otpOptional.isPresent() && otpOptional.get().getOtpCode().equals(otp)) {
            otpRepository.delete(otpOptional.get());
            return true;
        }
        return false;
    }
}

