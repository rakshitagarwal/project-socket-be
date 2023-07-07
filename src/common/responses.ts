import { IResponseBody } from "./typings/common.type";

/**
 * @class Response
 * @description this is used generate the response
 */
class Response {
    private _response: IResponseBody = <IResponseBody>{};
    constructor(responseInfo: IResponseBody) {
        this._response = { ...responseInfo };
    }
    get response() {
        return this._response;
    }
}

/**
 * @class ResponseBuilder
 * @description response builder is builder design pattern use to create http response body
 */
class ResponseBuilder {
    private newResponse: IResponseBody = <IResponseBody>{};

    /**
     * @description error code of response
     * @param {number} code response code
     * @returns {ResponseBuilder} this
     */
    error(code: number): ResponseBuilder {
        this.newResponse.code = code;
        if (code >= 400 && code <= 599) {
            this.newResponse.success = false;
        } else {
            // TO-TO: throw an error
        }
        return this;
    }

    /**
     * @description success code of response
     * @param {number} code response code
     * @returns {ResponseBuilder} this
     */
    success(code: number): ResponseBuilder {
        this.newResponse.code = code;
        if (code >= 200 && code <= 299) {
            this.newResponse.success = true;
        } else {
            // TO-TO: throw an error
        }
        return this;
    }

    /**
     * @description message string of response
     * @param {string} msg response message
     * @returns {ResponseBuilder} this
     */
    message(msg: string): ResponseBuilder {
        this.newResponse.message = msg;
        return this;
    }

    /**
     * @description metadata of response
     * @param {object} metadata response metadata
     * @returns {ResponseBuilder} this
     */
    metaData(metadata: object = {}): ResponseBuilder {
        this.newResponse.metadata = metadata;
        return this;
    }

    /**
     * @description data of response
     * @param {object} d response data
     * @returns {ResponseBuilder} this
     */
    data(d: object = {}): ResponseBuilder {
        this.newResponse.data = d;
        return this;
    }

    // methods of predefined error messages

    /**
     * @description https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/400
     * @param {string} message response message
     * @param {object} data response metadata
     * @param {object} metadata response data
     * @returns {IResponseBody} response body
     */
    badRequestError(
        message = "Bad request!",
        data = {},
        metadata: object = {}
    ): IResponseBody {
        this.error(400).message(message).metaData(metadata).data(data);
        return this.build();
    }

    /**
     * @description https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/401
     * @param {msg} msg response message
     * @param {object} data response data
     * @param {object} metadata response metadata
     * @returns {IResponseBody} response body
     */
    unauthorizedError(
        msg = "Unauthorized!",
        data = {},
        metadata = {}
    ): IResponseBody {
        this.error(401).message(msg).metaData(metadata).data(data);
        return this.build();
    }

    /**
     * @description https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/500
     * @param {string} msg response message
     * @param {object} data response data
     * @param {object} metadata response metadata
     * @returns {IResponseBody} response body
     */
    internalserverError(
        msg = "Internal server error!",
        data = {},
        metadata: object = {}
    ): IResponseBody {
        this.error(500).message(msg).metaData(metadata).data(data);
        return this.build();
    }

    /**
     * @description https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/404
     * @param {string} msg response message
     * @param {object} data response data
     * @param {object} metadata response metadata
     * @returns {IResponseBody} response body
     */
    notFoundError(
        msg = "Not found!",
        data = {},
        metadata: object = {}
    ): IResponseBody {
        this.error(404).message(msg).metaData(metadata).data(data);
        return this.build();
    }

    /**
     * @description https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/403
     * @param {string} msg response message
     * @param {object} data response data
     * @param {object} metadata response metadata
     * @returns {IResponseBody} response body
     */
    forbiddenError(
        msg = "Forbidden!",
        data = {},
        metadata: object = {}
    ): IResponseBody {
        this.error(403).message(msg).metaData(metadata).data(data);
        return this.build();
    }

    /**
     * @description https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/406
     * @param {string} msg response message
     * @param {object} data response data
     * @param {object} metadata response metadata
     * @returns {IResponseBody} response body
     */
    notAcceptableError(
        msg = "Not Acceptable",
        data = {},
        metadata: object = {}
    ): IResponseBody {
        this.error(406).message(msg).metaData(metadata).data(data);
        return this.build();
    }

    /**
     * @description https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/502
     * @param {msg} msg response message
     * @param {object} data response data
     * @param {object} metadata response metadata
     * @returns {IResponseBody} response body
     */
    badGateWayError(
        msg = "Bad gateway!",
        data = {},
        metadata: object = {}
    ): IResponseBody {
        this.error(502).message(msg).metaData(metadata).data(data);
        return this.build();
    }

    /**
     * @description https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/503
     * @param {object} msg response message
     * @param {object} data response data
     * @param {object} metadata response metadata
     * @returns {IResponseBody} response body
     */
    serviceUnavailableError(
        msg = "Service unavailable!",
        data = {},
        metadata: object = {}
    ): IResponseBody {
        this.error(503).message(msg).metaData(metadata).data(data);
        return this.build();
    }

    /**
     * @description https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/409
     * @param {object} msg response message
     * @param {object} data response metadata
     * @param {object} metadata response metadata
     * @returns {IResponseBody} response body
     */

    conflictError(
        msg = "Data already exist!",
        data = {},
        metadata: object = {}
    ): IResponseBody {
        this.error(409).message(msg).data(data).metaData(metadata);
        return this.build();
    }
    /**
     * @description https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/501
     * @param {object} msg response message
     * @param {object} data response metadata
     * @param {object} metadata response metadata
     * @returns {IResponseBody} response body
     */
    notImplementedError(
        msg = "Not implemented!",
        data = {},
        metadata: object = {}
    ): IResponseBody {
        this.error(501).message(msg).data(data).metaData(metadata);
        return this.build();
    }

    // methods of predefined error messages

    /**
     * @description https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/200
     * @param {string} msg response message
     * @param {object} data response data
     * @param {object} metadata response metadata
     * @returns {IResponseBody} response body
     */
    okSuccess(
        msg = "Ok",
        data: object = {},
        metadata: object = {}
    ): IResponseBody {
        return this.success(200)
            .message(msg)
            .data(data)
            .metaData(metadata)
            .build();
    }

    /**
     * @description https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/201
     * @param {string} msg response message
     * @param {object} data response data
     * @param {object} metadata response metadata
     * @returns {IResponseBody} response body
     */
    createdSuccess(
        msg = "Resource created!",
        data = {},
        metadata = {}
    ): IResponseBody {
        return this.success(201)
            .message(msg)
            .metaData(metadata)
            .data(data)
            .build();
    }

    /**
     * @description https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/417
     * @param {string} msg response message
     * @param {object} data response data
     * @param {object} metadata response metadata
     * @returns {IResponseBody} response body
     */
    expectationField(
        msg = "Expectation faild!",
        data = {},
        metadata: object = {}
    ): IResponseBody {
        this.error(417).message(msg).data(data).metaData(metadata);
        return this.build();
    }
    /**
     * @description build response
     * @returns {IResponseBody} response body
     */
    build(): IResponseBody {
        const newResponse = new Response(this.newResponse).response;
        this.newResponse = <IResponseBody>{};
        return newResponse;
    }
}

export const responseBuilder = new ResponseBuilder();

export const sanitize = function (data: string): string {
    const words = data.toLocaleLowerCase().trim().split(' ');
    const sanitizedWords: string[] = [];
    words.forEach((word) => {
        word.length ? sanitizedWords.push(word) : null;
    });
    return sanitizedWords.join(' ');
};