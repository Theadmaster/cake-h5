import { NextResponse } from 'next/server';
import crypto from 'crypto';

const ACCESS_KEY = '9csrumG5mjmPhhqoxgBVTjo1syiIGLD5OdAIEkir';
const SECRET_KEY = 'AbyjsVWElbUaDcQ3hJsTfYt_FMIRJuvNAaWdjDXh';
const BUCKET = 'ohmycake';
const DOMAIN = 'kodo-omc.etootech.com';

// Base64 URL安全编码
function base64ToUrlSafe(v: string) {
  return v.replace(/\//g, '_').replace(/\+/g, '-');
}

// 生成上传凭证
function generateUploadToken() {
  const putPolicy = JSON.stringify({
    scope: BUCKET,
    deadline: Math.floor(Date.now() / 1000) + 3600, // 1小时有效
    returnBody: JSON.stringify({
      key: '$(key)',
      hash: '$(etag)',
      size: '$(fsize)',
      mimeType: '$(mimeType)',
    }),
  });

  const encodedPutPolicy = base64ToUrlSafe(Buffer.from(putPolicy).toString('base64'));
  const sign = crypto
    .createHmac('sha1', SECRET_KEY)
    .update(encodedPutPolicy)
    .digest('base64');
  const encodedSign = base64ToUrlSafe(sign);

  return `${ACCESS_KEY}:${encodedSign}:${encodedPutPolicy}`;
}

// 获取上传凭证
export async function GET() {
  try {
    const token = generateUploadToken();

    return NextResponse.json({
      code: 0,
      data: {
        token,
        domain: DOMAIN,
        bucket: BUCKET,
        uploadUrl: 'https://upload.qiniup.com',
      },
    });
  } catch (error) {
    console.error('获取上传凭证失败:', error);
    return NextResponse.json(
      { code: -1, message: '获取上传凭证失败' },
      { status: 500 }
    );
  }
}
