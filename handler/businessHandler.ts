import { useCallback } from 'react'
import axios from 'axios'
import { toast } from "@/components/ui/use-toast"
import { ApiResponse } from '@/backend/types/ApiResponse'
import { BusinessDetails, Business, Client, Item, Invoice } from '@/backend/types/type'

export const useBusinessHandlers = (
  setBusinessDetails: React.Dispatch<React.SetStateAction<BusinessDetails>>,
  setSelectedBusinessId: React.Dispatch<React.SetStateAction<string>>,
  setClients: React.Dispatch<React.SetStateAction<Client[]>>,
  setItems: React.Dispatch<React.SetStateAction<Item[]>>,
  setInvoiceHistory: React.Dispatch<React.SetStateAction<Invoice[]>>,
  businessDetails,
  user_id
) => {
  const handleBusinessDetailsChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setBusinessDetails(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }, [setBusinessDetails])

  const handleSaveBusinessDetails = useCallback(async (businessDetails: BusinessDetails) => {
    try {
      const response = await axios.post<ApiResponse>('/api/setBusiness', businessDetails);
      
      if (response.data && response.data.message) {
        toast({
          title: "Success",
          description: response.data.message
        });
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Error setting business', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Error saving business details',
        variant: 'destructive'
      });
    }
  }, []);

  const fetchBusinessDetails = useCallback(async (businessId: string) => {
    try {
      const response = await axios.get<ApiResponse>(`/api/getBusinessDetails?business_id=${businessId}`);
      if (response.data && response.data.businesses) {
        setBusinessDetails({
          ...businessDetails,
          name: response.data.businesses[0].name,
          contact: response.data.businesses[0].contact,
          address: response.data.businesses[0].address,
          description: response.data.businesses[0].description,
          gstNumber: response.data.businesses[0].gst_number
        });
        setClients(response.data.businesses[0].clients)
        setItems(response.data.businesses[0].items)
        
        toast({
          title: "Business Changed",
          description: `Switched to ${response.data.businesses[0].name}`,
        });
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Error fetching business details', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch business details',
        variant: 'destructive'
      });
    }
  }, [businessDetails, setBusinessDetails, setClients, setItems]);

  const handleBusinessChange = useCallback((businessId: string) => {
    setSelectedBusinessId(businessId);
    
    setBusinessDetails({
      userId: "",
      name: "",
      email: "",
      address: "",
      description: "",
      gstNumber: ""
    });
    setClients([]);
    setItems([]);
    setInvoiceHistory([]);
    
    fetchBusinessDetails(businessId);
    console.log(businessId);
    
  }, [setSelectedBusinessId, setBusinessDetails, setClients, setItems, setInvoiceHistory, fetchBusinessDetails])

  const handleDeleteBusiness = useCallback(async (business_id:string) => {
    try {
      
      
      console.log(business_id);
      const response = await axios.delete<ApiResponse>(`/api/getBusinessDetails?business_id=${business_id}`);
      
      if (response.data && response.data.message) {
        toast({
          title: "Success",
          description: response.data.message
        });

        // Fetch the updated list of businesses
        const businessesResponse = await axios.get<ApiResponse>(`/api/getUserDetails?user_id=${user_id}`);
        
        if (businessesResponse.data && businessesResponse.data.businesses && businessesResponse.data.businesses.length > 0) {
          // Select the first business in the updated list
          const nextBusiness = businessesResponse.data.businesses[0];
          setSelectedBusinessId(nextBusiness._id);
          
          // Fetch details for the next business
          await fetchBusinessDetails(nextBusiness.id);
        } else {
          // If no businesses left, reset all states
          setSelectedBusinessId('');
          setBusinessDetails({
            userId: "",
            name: "",
            email: "",
            address: "",
            description: "",
            gstNumber: ""
          });
          setClients([]);
          setItems([]);
          setInvoiceHistory([]);

          toast({
            title: "Info",
            description: "No more businesses available. Please create a new business.",
          });
        }
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Error deleting business', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Error deleting business',
        variant: 'destructive'
      });
    }
  }, [businessDetails.userId, setSelectedBusinessId, setBusinessDetails, setClients, setItems, setInvoiceHistory, fetchBusinessDetails]);

  return {
    handleBusinessDetailsChange,
    handleSaveBusinessDetails,
    handleBusinessChange,
    handleDeleteBusiness
  }
}