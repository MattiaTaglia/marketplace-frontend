import UrlService from "$lib/services/urls/url.service";
import Cookies from 'js-cookie'
import qs from 'qs'

export type Params = {
  url: string,
  body?: any,
  headers?: Record<string, string>
}

export type MultiPartFormDataPostParams = {
  url: string,
  body?: FormData,
  headers?: Record<string, string>
}

export type PostParams = Params

export type PutParams = Params

export type DeleteParams = Params

export type GetParams = {
  url: string,
  params?: string | string[][] | Record<string, any> | URLSearchParams | undefined,
  headers?: Record<string, string>
}

export abstract class FetchBasedService {
  protected fetch: any;
  protected urls: {
    api: string
  };
  // Preventing XSS or CSRF attack could be done with generating 
  // many random token with random keys in the coockies and save 
  // wich one is the right one
  protected cookieName: string = "token"
  protected cookieWalletAddress: string = "wallet-address"

  constructor(params: {
    fetch: any,
    urls?: {
      api: string
    }
  }) {
    if (!params.fetch) throw new Error("service must have a definition of fetch");

    this.fetch = params.fetch.bind(window)
    if (!!params.urls) {
      this.urls = params.urls
    } else {      
      this.urls = {
        api:''// UrlService.api
      }

    }
  }

  protected async multiPartFormDataPost(params: MultiPartFormDataPostParams) {
    const response = await this.fetch(this._calculateApiUrl(params.url), {
      method: 'POST',
      headers: this._calculateHeaders(params.headers, true),
      body: params.body
    })

    if(response.status !== 200) {
      throw await response.json()
    }

    let jsonText = await response.text()
    if (!!jsonText) {
      return JSON.parse(jsonText)
    } else {
      return {}
    }
  }

  protected async post(params: PostParams) {
    const response = await this.fetch(this._calculateApiUrl(params.url), {
      method: 'POST',
      headers: this._calculateHeaders(params.headers),
      body: JSON.stringify(params.body)
    })

    if (response.status != 200) {
      throw await response.json()
    }

    let jsonText = await response.text()
    if (!!jsonText) {
      return JSON.parse(jsonText)
    } else {
      return {}
    }
  }

  protected async put(params: PutParams) {
    const response = await this.fetch(this._calculateApiUrl(params.url), {
      method: 'PUT',
      headers: this._calculateHeaders(params.headers),
      body: JSON.stringify(params.body)
    })

    if (response.status != 200) {
      throw await response.json()
    }

    return response.json()
  }

  protected async delete(params: DeleteParams) {
    const response = await this.fetch(this._calculateApiUrl(params.url), {
      method: 'DELETE',
      headers: this._calculateHeaders(params.headers),
      body: JSON.stringify(params.body)
    })

    if (response.status != 200) {
      throw await response.json()
    }

    let jsonText = await response.text()
    if (!!jsonText) {
      return JSON.parse(jsonText)
    } else {
      return {}
    }
  }

  protected async   get(params: GetParams) {
    return await this.fetch(
      this._calculateApiUrl(params.url)
      + '?'
      + qs.stringify(params.params),
      {
        headers: this._calculateHeaders(params.headers),
      }
    ).then((response: any) => {
      if(response.status != 200) throw response
      else return response.json()
    })
  }

  private _calculateApiUrl(url: string) {
    console.log(this.urls.api + url)

    return this.urls.api + url
  }

  private _calculateHeaders(paramsHeader?: Record<string, string>, multiFormData?: boolean): Record<string, string> {
    let headers: Record<string, string> = {}
    if (!!paramsHeader) headers = paramsHeader

    let token: string | undefined = Cookies.get(this.cookieName)
    let walletAddress: string | undefined = Cookies.get(this.cookieWalletAddress)

    if (!!token) headers['Authorization'] = "Bearer " + token
    if (!!walletAddress) headers['Wallet'] = "Address " + walletAddress

    if(multiFormData !== true) {
      headers['Content-Type'] = 'application/json'
    }

    return headers
  }
}