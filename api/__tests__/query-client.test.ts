import { AxiosError, AxiosHeaders } from 'axios';
import { Alert } from 'react-native';
import {
  createQueryClient,
  isNonRetryableError,
  getErrorMessage,
  getErrorStatus,
  getServerErrorCode,
  shouldRetryQuery,
  calculateRetryDelay,
  NON_RETRYABLE_STATUS_CODES,
  MAX_RETRY_COUNT,
  RETRY_BASE_DELAY,
  MAX_RETRY_DELAY,
  SERVER_ERROR_CODES,
} from '../query-client';

// ============================================================================
// Test Utilities
// ============================================================================

interface CreateAxiosErrorOptions {
  message?: string;
  errorCode?: number;
}

const createAxiosError = (
  status: number,
  options?: string | CreateAxiosErrorOptions
): AxiosError => {
  const opts: CreateAxiosErrorOptions =
    typeof options === 'string' ? { message: options } : options || {};

  const error = new AxiosError(opts.message || 'Test error');
  error.response = {
    status,
    statusText: 'Error',
    headers: {},
    config: { headers: new AxiosHeaders() },
    data: {
      message: opts.message || null,
      errorCode: opts.errorCode,
    },
  };
  return error;
};

// ============================================================================
// createQueryClient Tests
// ============================================================================

describe('createQueryClient', () => {
  describe('QueryClient 생성', () => {
    it('QueryClient 인스턴스를 반환해야 한다', () => {
      const queryClient = createQueryClient();

      expect(queryClient).toBeDefined();
      expect(queryClient.getDefaultOptions()).toBeDefined();
    });

    it('매 호출마다 새로운 인스턴스를 생성해야 한다', () => {
      const client1 = createQueryClient();
      const client2 = createQueryClient();

      expect(client1).not.toBe(client2);
    });

    it('QueryCache가 설정되어야 한다', () => {
      const queryClient = createQueryClient();
      const queryCache = queryClient.getQueryCache();

      expect(queryCache).toBeDefined();
    });

    it('MutationCache가 설정되어야 한다', () => {
      const queryClient = createQueryClient();
      const mutationCache = queryClient.getMutationCache();

      expect(mutationCache).toBeDefined();
    });
  });

  describe('커스텀 설정', () => {
    it('staleTime을 커스터마이징할 수 있다', () => {
      const customStaleTime = 30 * 1000; // 30초
      const queryClient = createQueryClient({ staleTime: customStaleTime });
      const options = queryClient.getDefaultOptions();

      expect(options.queries?.staleTime).toBe(customStaleTime);
    });

    it('gcTime을 커스터마이징할 수 있다', () => {
      const customGcTime = 10 * 60 * 1000; // 10분
      const queryClient = createQueryClient({ gcTime: customGcTime });
      const options = queryClient.getDefaultOptions();

      expect(options.queries?.gcTime).toBe(customGcTime);
    });

    it('maxRetries를 커스터마이징할 수 있다', () => {
      const queryClient = createQueryClient({ maxRetries: 5 });
      const options = queryClient.getDefaultOptions();
      const retryFn = options.queries?.retry as (
        failureCount: number,
        error: Error
      ) => boolean;

      const error = new Error('Test');
      expect(retryFn(4, error)).toBe(true); // 5번째까지 재시도
      expect(retryFn(5, error)).toBe(false); // 6번째는 안 함
    });
  });

  describe('기본 옵션 설정', () => {
    it('staleTime이 1분(60000ms)으로 설정되어야 한다', () => {
      const queryClient = createQueryClient();
      const options = queryClient.getDefaultOptions();

      expect(options.queries?.staleTime).toBe(60 * 1000);
    });

    it('gcTime이 5분(300000ms)으로 설정되어야 한다', () => {
      const queryClient = createQueryClient();
      const options = queryClient.getDefaultOptions();

      expect(options.queries?.gcTime).toBe(5 * 60 * 1000);
    });

    it('refetchOnWindowFocus가 false로 설정되어야 한다', () => {
      const queryClient = createQueryClient();
      const options = queryClient.getDefaultOptions();

      expect(options.queries?.refetchOnWindowFocus).toBe(false);
    });

    it('refetchOnReconnect가 true로 설정되어야 한다', () => {
      const queryClient = createQueryClient();
      const options = queryClient.getDefaultOptions();

      expect(options.queries?.refetchOnReconnect).toBe(true);
    });

    it('refetchOnMount가 true로 설정되어야 한다', () => {
      const queryClient = createQueryClient();
      const options = queryClient.getDefaultOptions();

      expect(options.queries?.refetchOnMount).toBe(true);
    });

    it('networkMode가 online으로 설정되어야 한다', () => {
      const queryClient = createQueryClient();
      const options = queryClient.getDefaultOptions();

      expect(options.queries?.networkMode).toBe('online');
    });

    it('structuralSharing이 true로 설정되어야 한다', () => {
      const queryClient = createQueryClient();
      const options = queryClient.getDefaultOptions();

      expect(options.queries?.structuralSharing).toBe(true);
    });

    it('retryDelay가 함수로 설정되어야 한다', () => {
      const queryClient = createQueryClient();
      const options = queryClient.getDefaultOptions();

      expect(typeof options.queries?.retryDelay).toBe('function');
    });
  });

  describe('mutations 기본 옵션', () => {
    it('mutations retry가 1로 설정되어야 한다', () => {
      const queryClient = createQueryClient();
      const options = queryClient.getDefaultOptions();

      expect(options.mutations?.retry).toBe(1);
    });

    it('mutations networkMode가 online으로 설정되어야 한다', () => {
      const queryClient = createQueryClient();
      const options = queryClient.getDefaultOptions();

      expect(options.mutations?.networkMode).toBe('online');
    });

    it('mutations retryDelay가 함수로 설정되어야 한다', () => {
      const queryClient = createQueryClient();
      const options = queryClient.getDefaultOptions();

      expect(typeof options.mutations?.retryDelay).toBe('function');
    });
  });

  describe('retry 로직', () => {
    type RetryFunction = (failureCount: number, error: Error) => boolean;
    let retryFn: RetryFunction;

    beforeEach(() => {
      const queryClient = createQueryClient();
      const options = queryClient.getDefaultOptions();
      retryFn = options.queries?.retry as RetryFunction;
    });

    it('retry 함수가 정의되어야 한다', () => {
      expect(typeof retryFn).toBe('function');
    });

    describe('Non-Retryable AxiosError 처리', () => {
      it.each(NON_RETRYABLE_STATUS_CODES)(
        '%i 에러는 재시도하지 않아야 한다',
        (status) => {
          const error = createAxiosError(status);

          expect(retryFn(0, error)).toBe(false);
          expect(retryFn(1, error)).toBe(false);
          expect(retryFn(2, error)).toBe(false);
        }
      );
    });

    describe('Retryable AxiosError 처리', () => {
      it.each([500, 502, 503, 504])(
        '%i 에러는 3회까지 재시도해야 한다',
        (status) => {
          const error = createAxiosError(status);

          expect(retryFn(0, error)).toBe(true); // 1번째 재시도
          expect(retryFn(1, error)).toBe(true); // 2번째 재시도
          expect(retryFn(2, error)).toBe(true); // 3번째 재시도
          expect(retryFn(3, error)).toBe(false); // 4번째는 안 함
        }
      );
    });

    describe('일반 에러 처리', () => {
      it('일반 Error는 3회까지 재시도해야 한다', () => {
        const error = new Error('Network error');

        expect(retryFn(0, error)).toBe(true);
        expect(retryFn(1, error)).toBe(true);
        expect(retryFn(2, error)).toBe(true);
        expect(retryFn(3, error)).toBe(false);
      });

      it('TypeError는 3회까지 재시도해야 한다', () => {
        const error = new TypeError('Type error');

        expect(retryFn(0, error)).toBe(true);
        expect(retryFn(1, error)).toBe(true);
        expect(retryFn(2, error)).toBe(true);
        expect(retryFn(3, error)).toBe(false);
      });
    });

    describe('재시도 횟수 경계값', () => {
      it('failureCount가 정확히 2일 때 true를 반환해야 한다', () => {
        const error = new Error('Test');
        expect(retryFn(2, error)).toBe(true);
      });

      it('failureCount가 정확히 3일 때 false를 반환해야 한다', () => {
        const error = new Error('Test');
        expect(retryFn(3, error)).toBe(false);
      });
    });
  });
});

// ============================================================================
// isNonRetryableError Tests
// ============================================================================

describe('isNonRetryableError', () => {
  describe('AxiosError 처리', () => {
    it.each(NON_RETRYABLE_STATUS_CODES)(
      '%i 상태 코드는 재시도 불가로 판단해야 한다',
      (status) => {
        const error = createAxiosError(status);
        expect(isNonRetryableError(error)).toBe(true);
      }
    );

    it.each([500, 502, 503, 504])(
      '%i 상태 코드는 재시도 가능으로 판단해야 한다',
      (status) => {
        const error = createAxiosError(status);
        expect(isNonRetryableError(error)).toBe(false);
      }
    );

    it('response가 없는 AxiosError는 재시도 가능으로 판단해야 한다', () => {
      const error = new AxiosError('Network Error');
      expect(isNonRetryableError(error)).toBe(false);
    });
  });

  describe('일반 에러 처리', () => {
    it('일반 Error는 재시도 가능으로 판단해야 한다', () => {
      const error = new Error('Something went wrong');
      expect(isNonRetryableError(error)).toBe(false);
    });

    it('null은 재시도 가능으로 판단해야 한다', () => {
      expect(isNonRetryableError(null)).toBe(false);
    });

    it('undefined는 재시도 가능으로 판단해야 한다', () => {
      expect(isNonRetryableError(undefined)).toBe(false);
    });

    it('문자열은 재시도 가능으로 판단해야 한다', () => {
      expect(isNonRetryableError('error')).toBe(false);
    });
  });
});

// ============================================================================
// getErrorMessage Tests
// ============================================================================

describe('getErrorMessage', () => {
  describe('AxiosError 처리', () => {
    it('response.data.message가 있으면 반환해야 한다', () => {
      const error = createAxiosError(500, 'Server Error');
      expect(getErrorMessage(error)).toBe('Server Error');
    });

    it('response.data.message가 없으면 error.message를 반환해야 한다', () => {
      const error = createAxiosError(500);
      expect(getErrorMessage(error)).toBe('Test error');
    });

    it('error.message도 없으면 기본 메시지를 반환해야 한다', () => {
      const error = new AxiosError();
      error.response = {
        status: 500,
        statusText: 'Error',
        headers: {},
        config: { headers: new AxiosHeaders() },
        data: null,
      };
      expect(getErrorMessage(error)).toBe('Network request failed');
    });
  });

  describe('일반 Error 처리', () => {
    it('Error.message를 반환해야 한다', () => {
      const error = new Error('Custom error message');
      expect(getErrorMessage(error)).toBe('Custom error message');
    });

    it('TypeError.message를 반환해야 한다', () => {
      const error = new TypeError('Type mismatch');
      expect(getErrorMessage(error)).toBe('Type mismatch');
    });
  });

  describe('기타 타입 처리', () => {
    it('null이면 기본 메시지를 반환해야 한다', () => {
      expect(getErrorMessage(null)).toBe('An unknown error occurred');
    });

    it('undefined이면 기본 메시지를 반환해야 한다', () => {
      expect(getErrorMessage(undefined)).toBe('An unknown error occurred');
    });

    it('문자열이면 기본 메시지를 반환해야 한다', () => {
      expect(getErrorMessage('string error')).toBe('An unknown error occurred');
    });

    it('숫자면 기본 메시지를 반환해야 한다', () => {
      expect(getErrorMessage(404)).toBe('An unknown error occurred');
    });
  });
});

// ============================================================================
// getErrorStatus Tests
// ============================================================================

describe('getErrorStatus', () => {
  describe('AxiosError 처리', () => {
    it.each([400, 401, 403, 404, 500, 502, 503])(
      '%i 상태 코드를 반환해야 한다',
      (status) => {
        const error = createAxiosError(status);
        expect(getErrorStatus(error)).toBe(status);
      }
    );

    it('response가 없으면 undefined를 반환해야 한다', () => {
      const error = new AxiosError('Network Error');
      expect(getErrorStatus(error)).toBeUndefined();
    });
  });

  describe('일반 에러 처리', () => {
    it('일반 Error는 undefined를 반환해야 한다', () => {
      const error = new Error('Something went wrong');
      expect(getErrorStatus(error)).toBeUndefined();
    });

    it('null은 undefined를 반환해야 한다', () => {
      expect(getErrorStatus(null)).toBeUndefined();
    });

    it('undefined는 undefined를 반환해야 한다', () => {
      expect(getErrorStatus(undefined)).toBeUndefined();
    });
  });
});

// ============================================================================
// shouldRetryQuery Tests
// ============================================================================

describe('shouldRetryQuery', () => {
  it.each(NON_RETRYABLE_STATUS_CODES)(
    '%i 에러는 재시도하지 않아야 한다',
    (status) => {
      const error = createAxiosError(status);
      expect(shouldRetryQuery(0, error)).toBe(false);
      expect(shouldRetryQuery(1, error)).toBe(false);
    }
  );

  it('서버 에러는 MAX_RETRY_COUNT까지 재시도해야 한다', () => {
    const error = createAxiosError(500);

    for (let i = 0; i < MAX_RETRY_COUNT; i++) {
      expect(shouldRetryQuery(i, error)).toBe(true);
    }
    expect(shouldRetryQuery(MAX_RETRY_COUNT, error)).toBe(false);
  });

  it('일반 에러는 MAX_RETRY_COUNT까지 재시도해야 한다', () => {
    const error = new Error('Network error');

    for (let i = 0; i < MAX_RETRY_COUNT; i++) {
      expect(shouldRetryQuery(i, error)).toBe(true);
    }
    expect(shouldRetryQuery(MAX_RETRY_COUNT, error)).toBe(false);
  });
});

// ============================================================================
// calculateRetryDelay Tests
// ============================================================================

describe('calculateRetryDelay', () => {
  it('지수 백오프 패턴을 따라야 한다', () => {
    // 지터 때문에 정확한 값 대신 범위 검사
    const delay0 = calculateRetryDelay(0);
    const delay1 = calculateRetryDelay(1);
    const delay2 = calculateRetryDelay(2);

    // 기본 지수 백오프: 1s, 2s, 4s
    // 지터 ±25% 적용
    expect(delay0).toBeGreaterThanOrEqual(RETRY_BASE_DELAY * 0.75);
    expect(delay0).toBeLessThanOrEqual(RETRY_BASE_DELAY * 1.25);

    expect(delay1).toBeGreaterThanOrEqual(RETRY_BASE_DELAY * 2 * 0.75);
    expect(delay1).toBeLessThanOrEqual(RETRY_BASE_DELAY * 2 * 1.25);

    expect(delay2).toBeGreaterThanOrEqual(RETRY_BASE_DELAY * 4 * 0.75);
    expect(delay2).toBeLessThanOrEqual(RETRY_BASE_DELAY * 4 * 1.25);
  });

  it('최대 지연 시간을 초과하지 않아야 한다', () => {
    // attemptIndex가 매우 클 때
    const delay = calculateRetryDelay(100);
    expect(delay).toBeLessThanOrEqual(MAX_RETRY_DELAY);
  });

  it('양수 값을 반환해야 한다', () => {
    for (let i = 0; i < 10; i++) {
      const delay = calculateRetryDelay(i);
      expect(delay).toBeGreaterThan(0);
    }
  });

  it('지터로 인해 같은 입력에도 다른 값이 나올 수 있다', () => {
    const delays = Array.from({ length: 100 }, () => calculateRetryDelay(0));
    const uniqueDelays = new Set(delays);

    // 100번 중 최소 몇 개는 다른 값이어야 함 (확률적)
    expect(uniqueDelays.size).toBeGreaterThan(1);
  });
});

// ============================================================================
// Constants Tests
// ============================================================================

describe('Constants', () => {
  it('NON_RETRYABLE_STATUS_CODES가 올바르게 정의되어야 한다', () => {
    expect(NON_RETRYABLE_STATUS_CODES).toContain(400);
    expect(NON_RETRYABLE_STATUS_CODES).toContain(401);
    expect(NON_RETRYABLE_STATUS_CODES).toContain(403);
    expect(NON_RETRYABLE_STATUS_CODES).toContain(404);
    expect(NON_RETRYABLE_STATUS_CODES).toContain(422);
  });

  it('MAX_RETRY_COUNT가 3이어야 한다', () => {
    expect(MAX_RETRY_COUNT).toBe(3);
  });

  it('RETRY_BASE_DELAY가 1000ms여야 한다', () => {
    expect(RETRY_BASE_DELAY).toBe(1000);
  });

  it('MAX_RETRY_DELAY가 30000ms여야 한다', () => {
    expect(MAX_RETRY_DELAY).toBe(30000);
  });

  it('SERVER_ERROR_CODES가 올바르게 정의되어야 한다', () => {
    expect(SERVER_ERROR_CODES.SESSION_EXPIRED).toBe(10033);
    expect(SERVER_ERROR_CODES.ACCOUNT_LOCKED).toBe(10034);
    expect(SERVER_ERROR_CODES.MAINTENANCE_MODE).toBe(10035);
    expect(SERVER_ERROR_CODES.FORCE_UPDATE_REQUIRED).toBe(10036);
    expect(SERVER_ERROR_CODES.ACCESS_DENIED).toBe(10037);
  });
});

// ============================================================================
// getServerErrorCode Tests
// ============================================================================

describe('getServerErrorCode', () => {
  describe('AxiosError with errorCode', () => {
    it('errorCode가 있으면 반환해야 한다', () => {
      const error = createAxiosError(403, { errorCode: 10033 });
      expect(getServerErrorCode(error)).toBe(10033);
    });

    it('다양한 errorCode를 올바르게 반환해야 한다', () => {
      expect(getServerErrorCode(createAxiosError(403, { errorCode: 10034 }))).toBe(10034);
      expect(getServerErrorCode(createAxiosError(500, { errorCode: 10035 }))).toBe(10035);
      expect(getServerErrorCode(createAxiosError(401, { errorCode: 10036 }))).toBe(10036);
    });

    it('errorCode가 없으면 undefined를 반환해야 한다', () => {
      const error = createAxiosError(403, { message: 'Forbidden' });
      expect(getServerErrorCode(error)).toBeUndefined();
    });

    it('response.data가 없으면 undefined를 반환해야 한다', () => {
      const error = new AxiosError('Network Error');
      expect(getServerErrorCode(error)).toBeUndefined();
    });
  });

  describe('일반 에러 처리', () => {
    it('일반 Error는 undefined를 반환해야 한다', () => {
      const error = new Error('Something went wrong');
      expect(getServerErrorCode(error)).toBeUndefined();
    });

    it('null은 undefined를 반환해야 한다', () => {
      expect(getServerErrorCode(null)).toBeUndefined();
    });

    it('undefined는 undefined를 반환해야 한다', () => {
      expect(getServerErrorCode(undefined)).toBeUndefined();
    });
  });
});

// ============================================================================
// Server Error Code Alert Tests
// ============================================================================

describe('Server Error Code Alert 처리', () => {
  const mockAlert = Alert.alert as jest.Mock;

  beforeEach(() => {
    mockAlert.mockClear();
  });

  // Note: handleServerErrorCode is internal, so we test through queryCache behavior
  // These tests verify that the Alert mock is properly set up for integration tests

  it('Alert.alert mock이 설정되어야 한다', () => {
    expect(mockAlert).toBeDefined();
    expect(typeof mockAlert).toBe('function');
  });

  it('Alert.alert 호출을 추적할 수 있어야 한다', () => {
    Alert.alert('Test Title', 'Test Message');
    expect(mockAlert).toHaveBeenCalledWith('Test Title', 'Test Message');
  });

  it('Alert.alert 호출 횟수를 추적할 수 있어야 한다', () => {
    Alert.alert('Title 1', 'Message 1');
    Alert.alert('Title 2', 'Message 2');
    expect(mockAlert).toHaveBeenCalledTimes(2);
  });
});
