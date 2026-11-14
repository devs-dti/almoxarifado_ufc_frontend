import { httpClient } from '@/infrastructure/http/client'
import { unwrapPage } from '@/shared/lib/pagination'
import type { BackendPageResponse } from '@/shared/types/pagination'
import type { ReportNotificationSettings, ReportNotificationType, ReportNotificationUpdate, ReportRecipient } from '../types/notifications'

const basePath = '/reports/notifications'

export const reportNotificationsApi = {
  list: () => httpClient.get<ReportNotificationSettings[]>(basePath).then((r) => r.data),
  update: (type: ReportNotificationType, payload: ReportNotificationUpdate) =>
    httpClient.put<ReportNotificationSettings>(`${basePath}/${type}`, payload).then((r) => r.data),
  searchRecipients: (search: string, page: number) =>
    httpClient.get<BackendPageResponse<ReportRecipient>>(`${basePath}/recipients`, {
      params: { search, page, size: 8 },
    }).then((r) => unwrapPage(r.data)),
}
