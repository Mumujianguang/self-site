import { lastValueFrom } from 'rxjs'
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { IHuaweiActivityRecord, IHuaweiToken } from './huawei.interface';

@Injectable()
export class HuaweiService {
    private token: IHuaweiToken

    constructor(private readonly httpService: HttpService) {}

    public async getAccessToken(code: string) {
        const response = await lastValueFrom(
            this.httpService.post<IHuaweiToken>(
                'https://oauth-login.cloud.huawei.com/oauth2/v3/token',
                {
                    code,
                    client_id: '112722049',
                    client_secret: 'cda8356757d2edc6855b68cd249fd44c9be68666463442e2a619c33cba367c4f',
                    redirect_uri: process.env.NODE_ENV === 'production' ? 'http://mmjg.site/' : 'http://localhost:5173/',
                    grant_type: 'authorization_code',
                },
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }
            )
        )

        const token = this.token = response.data

        return token
    }

    public async getActivityRecords(params: {
        startTime: string
        endTime: string
    }): Promise<IHuaweiActivityRecord[]>
    {
        const response = await lastValueFrom(
            this.httpService.get<{
                activityRecord: IHuaweiActivityRecord[]
            }>(
                'https://health-api.cloud.huawei.com/healthkit/v2/activityRecords',
                {
                    params,
                    headers: {
                        Authorization: `Bearer ${this.token?.access_token}`
                    }
                }
            )
        )

        return response.data.activityRecord
    }
}
