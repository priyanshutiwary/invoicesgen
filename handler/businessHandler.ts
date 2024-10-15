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
  businessDetails
) => {
  const handleBusinessDetailsChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setBusinessDetails(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }, [setBusinessDetails])

  const handleSaveBusinessDetails = async (businessDetails: BusinessDetails) => {
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
  };

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
  }, [setBusinessDetails, setSelectedBusinessId, setClients, setItems, setInvoiceHistory])

  const fetchBusinessDetails = async (businessId: string) => {
    try {
     
      const response = await axios.get<ApiResponse>(`/api/getBusinessDetails?business_id=${businessId}`);
      console.log(response.data.businesses[0])
      if (response.data && response.data.businesses) {
        // setBusinessDetails(response.data.businesses);
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
        console.log();
        
        
        
        
        
        
        
        
        toast({
          title: "Business Changed",
          description: `Switched to ${response.data.businessDetails.name}`,
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
  };
  

  return {
    handleBusinessDetailsChange,
    handleSaveBusinessDetails,
    handleBusinessChange
  }
}