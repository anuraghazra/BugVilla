import { renderHook } from '@testing-library/react-hooks';
import useFetch from 'hooks/useFetch';
import http from 'utils/httpInstance';
import MockAdapter from 'axios-mock-adapter';

jest.unmock('axios');
const mockData = {
  data: [
    {
      name: 'Anurag Hazra',
      username: 'anuraghazra',
      id: '5e11eda3827f26148c3d1f35'
    },
    {
      username: 'newuser',
      name: 'John doe',
      id: '5e47e0cfee6f4e17786948a5'
    }
  ]
};

describe('useFetch', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('should test useFetch', async () => {
    const mock = new MockAdapter(http);
    const url = '/api/user';
    mock.onGet(url).reply(200, mockData);

    const { result, waitForNextUpdate } = renderHook(() =>
      useFetch('/api/user')
    );

    expect(result.current[0]).toBe(null);
    expect(result.current[1]).toBe(true);
    expect(result.current[2]).toBe(null);

    await waitForNextUpdate();

    expect(result.current[0]).toStrictEqual(mockData);
    expect(result.current[1]).toBeFalsy();
    expect(result.current[2]).toBe(null);
  });

  it('should set loading to false and returns error on network error', async () => {
    const mock = new MockAdapter(http);
    const url = '/api/usedr';
    mock.onGet(url).reply(500, {
      error: 'Something went wrong'
    });

    const { result, waitForNextUpdate } = renderHook(() =>
      useFetch('/api/usedr')
    );

    await waitForNextUpdate();

    expect(result.current[0]).toBe(null);
    expect(result.current[1]).toBeFalsy();
    expect(result.current[2]).toBe('Something went wrong');
  });

  it('should also accept additional options', async () => {
    const mock = new MockAdapter(http);
    mock.onPost('/api/post').reply(200, {
      data: 'post data'
    });

    const { result, waitForNextUpdate } = renderHook(() =>
      useFetch('/api/post', {}, { method: 'POST', data: { msg: 'ok' } })
    );

    await waitForNextUpdate();

    expect(result.current[0]).toStrictEqual({ data: 'post data' });
    expect(result.current[1]).toBeFalsy();
    expect(result.current[2]).toBe(null);
  });
});
