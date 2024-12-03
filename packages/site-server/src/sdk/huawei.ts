
import * as path from "path";
import { AGCClient, CredentialParser } from "@agconnect/common-server"

const JSON_PATH = path.resolve(__dirname, '../../agc-apiclient.json');

/**
 * 初始化华为SDK
 */
export default function setupHuaweiSDK() {
    const credential = CredentialParser.toCredential(JSON_PATH);

    AGCClient.initialize(credential);
}
