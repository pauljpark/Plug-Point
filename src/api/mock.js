//mock the success/failure of an API call based on a promise after two seconds,
//then return the passed-in value

export const mockSuccess = (value) => {
    return new Promise((resolve) => {
        setTimeout(() => resolve(value), 2000)
    })
}

export const mockFailure = (value) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => reject(value), 2000)
    })
}