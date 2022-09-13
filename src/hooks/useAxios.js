import {useState, useEffect} from 'react'

const useAxios = (configObj) => {
    const {
        axiosInstance, // đối tượng axios - cho phép dùng nhiều hơn 1 đối tượng axios
        method,
        url,
        requestConfig = {} //đối tượng cấu hình
    } = configObj;

    const [response, setResponse] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        
        //let isMounted = true;
        const controller = new AbortController();
        //AbortController: dùng để hủy các request đang thực hiện mỗi khi component được cập nhật và không bị rò rỉ bộ nhớ
        const fetchData = async () => {  //async: khai báo hàm bất đồng bộ
            setLoading(true);
            try {
                //await: tạm dừng việc thực hiện các hàm async
                await axiosInstance[method.toLowerCase()](url, {
                    ...requestConfig,
                    //signal: controller.signal
                })
                .then((res) => {
                    console.log('');
                    setResponse(res.data);
                })  
                              
            } 
            catch (err) {
                console.log('');
                setError(err.message);                
            } 
            finally {
                setLoading(false);
            }            
        }

        // call the function
        fetchData();
        
        // useEffect cleanup function
        return () => controller.abort();
        // eslint-disable-next-line
    }, [url]);

    return [response, error, loading];
}

export default useAxios

