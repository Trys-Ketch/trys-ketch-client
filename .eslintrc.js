module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'airbnb',
    'airbnb/hooks',
    'plugin:react/recommended',
    'plugin:import/recommended',
    'plugin:prettier/recommended',
    'eslint:recommended',
    'prettier',
  ],
  plugins: ['react', 'import', 'prettier'],
  parser: '@babel/eslint-parser',
  parserOptions: { sourceType: 'module' },
  rules: {
    'no-unused-vars': ['off'], // 사용하지 않는 변수가 있을때 빌드에러가 나던 규칙 해제
    'no-console': ['off'], // 콘솔을 쓰면 에러가 나던 규칙 해제
    'react/function-component-definition': [2, { namedcomponents: 'arrow-function' }],
    'react-hooks/exhaustive-deps': ['warn'], // hooks의 의존성배열이 충분하지 않을때 강제로 의존성을 추가하는 규칙을 완화
    'react/jsx-props-no-spreading': [1, { custom: 'ignore' }], // props spreading을 허용하지 않는 규칙 해제
    'react/prop-types': 0, // prop-types를 선언해주어야하는 규칙 해제
    'no-param-reassign': 0, // 파라미터 변경을 허용하지 않는 규칙 해제
    'consistent-return': 0, // 화살표 함수에서 return이 안되는 규칙 해제
    'no-underscore-dangle': 0, // 함수 이름을 시작할 때 언더바를 사용할 수 없는 규칙 해제
    'no-useless-escape': 0, // 정규식 사용시 문제가 되는 규칙 해제
    'prefer-destructuring': ['error', { object: true, array: false }], // 배열 인덱스에 접근 시 반드시 구조분해 할당을 사용해야하는 규칙 해제
    'react/jsx-filename-extension': [2, { extensions: ['.js', '.jsx', '.ts', '.tsx'] }],
    'prettier/prettier': ['error', { endOfLine: 'auto' }],
    'no-shadow': 0, // 변수명의 쉐도잉을 제한하는 규칙 해제,
    'react/no-array-index-key': 0, // array index를 key값으로 사용할 수 없는 규칙 해제
    'import/no-mutable-exports': 0, // var이나 let과 같은 변경가능한 값의 export를 금지하는 규칙 해제
    'no-continue': 0, // continue를 사용하지 못하게 하는 규칙 해제
  },
};
