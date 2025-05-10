import React, { useEffect, useState } from 'react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card'
import { Heart, Loader2, AlertCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface AdmissionInfo {
  admission_date?: string
  discharge_date?: string
  updated_at?: string
  reason?: string
  status?: string
  room?: {
    room_id?: string
    room_type?: string
    department?: {
      name?: string
    }
  }
  nurse?: {
    user?: {
      first_name?: string
      last_name?: string
    }
  }
}

interface AdmissionDetailsProps {
  patientId?: string
  roomNumber?: string
  visitDate?: string
}

const AdmissionDetails: React.FC<AdmissionDetailsProps> = ({ patientId, visitDate }) => {
  const [admissionInfo, setAdmissionInfo] = useState<AdmissionInfo | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Only fetch if we have a patient ID
    if (!patientId) return;

    setIsLoading(true);
    setError(null);

    fetch(`/api/admission/${patientId}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log('Admission data received:', data);
        // API returns an array, take the first item if available
        const admissionData = Array.isArray(data) && data.length > 0 ? data[0] : data;
        setAdmissionInfo(admissionData);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching admission data:", error);
        setError("Failed to load admission details");
        setIsLoading(false);
      });
  }, [patientId]);

  // Check if we have admission data from the API
  const hasAdmissionData = admissionInfo &&
    typeof admissionInfo === 'object' &&
    Object.keys(admissionInfo).length > 0;

  // Use API data if available, otherwise fall back to props
  const displayRoomId = hasAdmissionData && admissionInfo.room
    ? admissionInfo.room.room_id || "Unknown"
    : "Unknown";

  const displayAdmissionDate = hasAdmissionData && admissionInfo.admission_date
    ? admissionInfo.admission_date
    : visitDate;

  // Ensure we properly check for existence and provide default values
  const displayRoomDept = hasAdmissionData && admissionInfo.room?.department?.name
    ? admissionInfo.room.department.name
    : null;

  const displayRoomType = hasAdmissionData && admissionInfo.room?.room_type
    ? admissionInfo.room.room_type
    : null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-medium flex items-center gap-2">
          <Heart className="h-4 w-4 text-muted-foreground" />
          Admission Details
        </CardTitle>
        {/* Debug output - remove in production */}
        <div className="text-xs text-gray-400 mt-1 break-all hidden">
          {JSON.stringify(admissionInfo)}
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center py-6">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground mr-2" />
            <span className="text-muted-foreground">Loading admission details...</span>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <AlertCircle className="h-5 w-5 text-muted-foreground mb-2" />
            <span className="text-muted-foreground text-sm">{error}</span>
          </div>
        ) : hasAdmissionData ? (
          <div className="space-y-3">
            {displayRoomId && displayRoomId !== "Unknown" && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Room ID:</span>
                <Badge variant="outline">{displayRoomId}</Badge>
              </div>
            )}

            {displayRoomType && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Room Type:</span>
                <Badge variant="outline">{displayRoomType}</Badge>
              </div>
            )}

            {displayRoomDept && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Department:</span>
                <Badge variant="outline">{displayRoomDept}</Badge>
              </div>
            )}

            {displayAdmissionDate && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Admission Date:</span>
                <span className="text-sm">{new Date(displayAdmissionDate).toLocaleDateString()}</span>
              </div>
            )}

            {/* Display additional admission details if available */}
            {admissionInfo.discharge_date && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Discharge Date:</span>
                <span className="text-sm">{new Date(admissionInfo.discharge_date).toLocaleDateString()}</span>
              </div>
            )}

            {admissionInfo.reason && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Reason:</span>
                <span className="text-sm">{admissionInfo.reason}</span>
              </div>
            )}

            {admissionInfo.status && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Status:</span>
                <Badge variant={admissionInfo.status === "Discharged" ? "secondary" : "default"}>
                  {admissionInfo.status}
                </Badge>
              </div>
            )}

            {admissionInfo.nurse?.user && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Assigned Nurse:</span>
                <span className="text-sm">
                  {admissionInfo.nurse.user.first_name} {admissionInfo.nurse.user.last_name}
                </span>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <span className="text-muted-foreground text-sm">Patient is not currently admitted</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdmissionDetails
