pragma circom 2.1.6;

include "@zk-email/circuits/utils/array.circom";

template Dkim(maxHeadersLength, n, k) {
    assert(maxHeadersLength % 64 == 0);
    assert(n * k > 2048); // to support 2048 bit RSA
    assert(n < (255 \ 2)); // for multiplication to fit in the field (255 bits)

    signal input emailHeader[maxHeadersLength];
    signal input emailHeaderLength;
    signal input pubkey[k];
    signal input signature[k];

    // Assert `emailHeaderLength` fits in `ceil(log2(maxHeadersLength))`
    component n2bHeaderLength = Num2Bits(log2Ceil(maxHeadersLength));
    n2bHeaderLength.in <== emailHeaderLength;


    // Assert `emailHeader` data after `emailHeaderLength` are zeros
    AssertZeroPadding(maxHeadersLength)(emailHeader, emailHeaderLength);

    // Calculate SHA256 hash of the `emailHeader` - 506,670 constraints
    signal sha[256] <== Sha256Bytes(maxHeadersLength)(emailHeader, emailHeaderLength);
    component bitPacker = PackBits(256, 128);
    bitPacker.in <== sha;
    signal output shaHi <== bitPacker.out[0];
    signal output shaLo <== bitPacker.out[1];

    // Pack SHA output bytes to int[] for RSA input message
    var rsaMessageSize = (256 + n) \ n;
    component rsaMessage[rsaMessageSize];
    for (var i = 0; i < rsaMessageSize; i++) {
        rsaMessage[i] = Bits2Num(n);
    }
    for (var i = 0; i < 256; i++) {
        rsaMessage[i \ n].in[i % n] <== sha[255 - i];
    }
    for (var i = 256; i < n * rsaMessageSize; i++) {
        rsaMessage[i \ n].in[i % n] <== 0;
    }

    // Verify RSA signature - 149,251 constraints
    component rsaVerifier = RSAVerifier65537(n, k);
    for (var i = 0; i < rsaMessageSize; i++) {
        rsaVerifier.message[i] <== rsaMessage[i].out;
    }
    for (var i = rsaMessageSize; i < k; i++) {
        rsaVerifier.message[i] <== 0;
    }
    rsaVerifier.modulus <== pubkey;
    rsaVerifier.signature <== signature;
}
