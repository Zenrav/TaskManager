import redis from '../config/redis.js';

export const getCache = async (key) => {
    const data = await redis.get(key)
    return data ? JSON.parse(data) : null
}

export const setCache = async (key, data, ttl = 300) => {
    await redis.set(key, JSON.stringify(data), 'Ex', ttl)
}

export const deleteCache = async(key) =>{
    await redis.del(key);
}

export const deleteCacheByPattern = async (pattern) =>{
    const keys = await redis.keys(pattern)
    if(keys.length > 0){
        await redis.del(...keys)
    }
}