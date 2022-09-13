
const genreIDs = (data, genre) => 
    {
        if(Array.isArray(genre) && genre.length>0)
        {
            const res = genre.filter( function(item) 
                {
                    return data.find(a => a === item.id)
                }
            ) 
            const tmp = res.map(i => i.name)       
            return tmp
        }
        return []
}

const useGetGenre = (data,genre) => 
{
    const res = data.map(genreID => {
        return genreIDs(genreID, genre)
    })
    return res
}

export default useGetGenre