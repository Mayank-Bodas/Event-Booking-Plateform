package com.ebp.qrcode.service;

import com.ebp.qrcode.domain.entities.QrCode;
import com.ebp.qrcode.domain.entities.Ticket;

public interface QrCodeService {
    QrCode generateQrCode(Ticket ticket);
}
