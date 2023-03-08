import { SERVER_API_ENDPOINT } from 'constants/envs';
import Request from '../request';

const NOTIFICATIONS_ENDPOINT = `${SERVER_API_ENDPOINT}/notification`;
const NOTIFICATIONS_COUNT_ENDPOINT = `${NOTIFICATIONS_ENDPOINT}/getCountNotification`;
const NOTIFICATIONS_MARK_READ_ALL_ENDPOINT = `${NOTIFICATIONS_ENDPOINT}/mark-read`;
const NOTIFICATIONS_MARK_READ_ENDPOINT = (id: string) => `${NOTIFICATIONS_ENDPOINT}/${id}`;
const NOTIFICATIONS_DELETE_ENDPOINT = (id: number) => `${NOTIFICATIONS_ENDPOINT}/${id}`;

interface INotificationParams {
  limit?: number;
  page?: number;
  keyword?: string;
  sortField?: string;
  sortDirection?: 'ASC' | 'DESC';
  id?: string;
}

const notificationService = {
  getListNotifications: async (params?: INotificationParams) => {
    try {
      const response = await Request.get(NOTIFICATIONS_ENDPOINT, params);
      return [response.data, null];
    } catch (error) {
      return [null, error];
    }
  },
  getCountNotifications: async () => {
    try {
      const response = await Request.get(NOTIFICATIONS_COUNT_ENDPOINT);
      return [response.data, null];
    } catch (error) {
      return [null, error];
    }
  },
  markReadAllNotifications: async () => {
    try {
      const response = await Request.put(NOTIFICATIONS_MARK_READ_ALL_ENDPOINT);
      return [response.data, null];
    } catch (error) {
      return [null, error];
    }
  },
  markReadNotification: async (params: { id: number }) => {
    try {
      const response = await Request.put(NOTIFICATIONS_MARK_READ_ENDPOINT(params.id));
      return [response.data, null];
    } catch (error) {
      return [null, error];
    }
  },
  softDeleteNotification: async (params: { id: number }) => {
    try {
      const response = await Request.delete(NOTIFICATIONS_DELETE_ENDPOINT(params.id));
      return [response.data, null];
    } catch (error) {
      return [null, error];
    }
  },
  softDeleteAllNotifications: async () => {
    try {
      const response = await Request.delete(NOTIFICATIONS_ENDPOINT);
      return [response.data, null];
    } catch (error) {
      return [null, error];
    }
  },
};

export default notificationService;
