import * as svgCaptcha from 'svg-captcha';
import { ErrorEnum } from '../enum/error.enum';
import { ConstantEnum } from '../enum/constant.enum';

export function generateCaptcha(session, color = true, noise = 4) {
  const captcha = svgCaptcha.create({
    color,
    noise,
  });
  session.captcha = {
    text: captcha.text.toLowerCase(),
    time: Date.now(),
  };
  return captcha;
}

export function verifyCaptcha(session, captchaText) {
  const captcha = session.captcha;
  // 验证码不存在
  if (!captcha) {
    return ErrorEnum.CAPTCHA_ERROR;
  }

  // 验证码是否过期
  const diff = (Date.now() - captcha.time) / 1000;
  if (diff > ConstantEnum.CAPTCHA_EXPIRES_TIME) {
    return ErrorEnum.CAPTCHA_EXPIRES;
  }
  // 验证码是否正确
  if (captcha.text !== captchaText.toLowerCase()) {
    return ErrorEnum.CAPTCHA_ERROR;
  }
  return 'ok'
}
