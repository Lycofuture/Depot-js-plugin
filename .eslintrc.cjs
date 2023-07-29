/*
 * @Author: Lycofuture
 * @Date: 2023-07-06 10:55:30
 * @LastEditors: Lycofuture 
 * @LastEditTime: 2023-07-06 11:01:06
 */
module.exports = {
  env: {
    es2021: true,
    node:true
  },
  rules: {
    'eslint-comments/no-unused-disable': error,
    'eslint-comments/no-unlimited-disable': error,
    'eslint-comments/no-unused-enable': error,
    'eslint-comments/disable-enable-pair': error,
    'eslint-comments/no-aggregating-enable': error,
    'eslint-comments/no-duplicate-disable': error,
    'eslint-comments/no-restricted-disable': error,
    'eslint-comments/no-use': [
      error,
      {
        allow: [
          eslint-disable,
          eslint-disable-line,
          eslint-disable-next-line,
          eslint-enable,
          eslint-env
        ]
      }
    ],
  }
}
