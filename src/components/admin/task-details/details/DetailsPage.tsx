"use client";

import Label from "@/components/common/Label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TbVideo } from "react-icons/tb";
import { IoCallOutline } from "react-icons/io5";
import Image from "next/image";
import React, { useEffect, useState } from "react";

import RowBoxDetailpage from "./RowBoxDetailpage";
import BackButton from "../../BackButton";
import { ArrowLeft, Ellipsis, MoreHorizontal, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EditPenicon, LogoutIcon, ShareIcon } from "@/assets/icons/SvgIcons";
import { useAppSelector } from "@/store/hooks";
import {
  useFetchIncidentByIncidentIdQuery,
  useFetchStatusUpdateByIncidentIdQuery,
  useStopIncidentTimerMutation,
  useUpdateIncidentStatusMutation,
} from "@/store/api/common/commonApi";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { setIsTimerStopped } from "@/store/api/common/incidentSlice";
import { useRouter } from "next/navigation";

const rasArra = [0, 1, 2, 3];
const statusArra = [
  {
    name: "Gilbert Lambert",
    status: "Warming stations established",
    dateAndTime: "13 Dec 2024, 12:45 PM",
  },
  {
    name: "Gilbert Lambert",
    status: "Conducting regular health checks",
    dateAndTime: "13 Dec 2024, 12:45 PM",
  },
];

const DetailsPage = () => {
  const [timer, setTimer] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [timerDialog, setTimerDialog] = useState(false)
  const [pendingStatus, setPendingStatus] = useState<string | null>(null)
  const isTimerStopped = useSelector((state: RootState) => state.incident.isTimerStopped)
  const dispatch = useDispatch();

  const router = useRouter()

  const incidentId = useAppSelector(
    (state) => state.incident.selectedIncidentId
  );

  const { data, isLoading, error, refetch } = useFetchIncidentByIncidentIdQuery(
    incidentId ?? "",
    { refetchOnMountOrArgChange: true }
  );

  const [stopIncidentTimer, { isLoading: isStoppingTimer }] =
    useStopIncidentTimerMutation();

  const [updateIncidentStatus] = useUpdateIncidentStatusMutation();

  const { data: statusData } = useFetchStatusUpdateByIncidentIdQuery(incidentId);

  const handleStatusChange = (newStatus: string) => {
    setPendingStatus(newStatus)
    setIsDialogOpen(true)
  }

  const confirmStatusChange = async () => {
    if (pendingStatus) {
      try {
        const response = await updateIncidentStatus({
          incidentId: incidentId ?? "",
          status: pendingStatus,
        }).unwrap()

        if (response?.success) {
          toast.success(response.message || `Status updated to: ${pendingStatus}`)
          refetch()
        } else {
          toast.success(`Status updated to: ${pendingStatus}`)
        }
      } catch (err) {
        toast.error("Failed to update status")
      }
    }
    setIsDialogOpen(false)
  }

  const formatDuration: any = (startDate: Date, endDate: Date) => {
    const diff = Math.abs(endDate.getTime() - startDate.getTime());
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}:${String(seconds).padStart(2, "0")}`;
  };

  function formatTimestampToTime(timestamp: Date) {
    const date = new Date(timestamp);
    date.setMinutes(date.getMinutes() + 330);
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    const seconds = String(date.getUTCSeconds()).padStart(2, '0');

    return `${hours}:${minutes}:${seconds}`;
  };


  useEffect(() => {

    if (data?.data?.isStopped) {
      const createdAt = new Date(data.data.createdAt);
      const stoppedTime = new Date(data.data.stoppedTime);

      setTimer(formatDuration(createdAt, stoppedTime));
      return;
    }

    const updateTimer = () => {
      const now = new Date();
      const created = new Date(data?.data.createdAt);
      const diff = Math.abs(now.getTime() - created.getTime());

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimer(
        `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
          2,
          "0"
        )}:${String(seconds).padStart(2, "0")}`
      );
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [data?.data.createdAt, data?.data.isStopped, data?.data.stoppedTime]);

  const handleStopTimer = async () => {
    try {
      await stopIncidentTimer(incidentId).unwrap();
      dispatch(setIsTimerStopped(!isStoppingTimer));
      await refetch();
      setTimerDialog(false);
      toast.success("Incident timer stopped successfully!");
    } catch (err) {
      console.error("Error stopping timer:", err);
      toast("Failed to stop timer.");
    }
  };

  if (!incidentId) {
    return <div></div>;
  }

  if (isLoading) {
    return <div></div>;
  }

  const utilityAffectedString =
    data?.data?.utilityAffected?.join(", ") ?? "N/A";

  const isTimerStopDisabled = data?.data?.isStopped || isStoppingTimer;

  const handleEdit = () => {
    if (incidentId) {
      router.push(`/admin/exploration-and-production/edit-incidents/${incidentId}`)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4 bg-transparent">
        <div className="flex items-center gap-6">
          <BackButton />

          <div>
            <h1 className="text-[20px] font-medium leading-none">Snow fall</h1>
            <p className="text-[14px] text-muted-foreground mt-0.5">
              Emerge-x cases ID : {data?.data.id}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="font-medium timerCOlor">{timer}</div>

          <div
            // onClick={() => handleStopTimer()}
            onClick={() => {
              if (!data?.data?.isStopped) {
                setTimerDialog(true)
              }
            }}
            className="logoutIconBG p-[8px] rounded-[10px] mr-4 cursor-pointer"
          >
            <LogoutIcon />
          </div>

          <div className="flex items-center gap-2">
            <button className="rounded-full border p-3 bg-white" onClick={handleEdit}>
              <EditPenicon />
            </button>

            <button className="rounded-full border p-3 bg-white">
              <ShareIcon />
            </button>
          </div>
        </div>
      </div>

      <div className=" space-y-7">
        <div className="bg-white rounded-[40px] p-[8px] space-y-4">
          <div
            className="grid gap-2  p-4 rounded-t-[30px] "
            style={{ background: "rgba(236, 244, 234, 1)" }}
          >
            <h2 className="text-sm font-medium text-muted-foreground ">Role</h2>
            <h2 className="text-[16px] font-medium text-black ">
              Onsite ERT Leader
            </h2>
            <h2 className="text-sm font-medium text-muted-foreground ">
              Description
            </h2>

            <p className="descColorText">{data?.data?.description || "N/A"}</p>
          </div>
          <div className="p-[24px]">
            <div className="flex flex-col md:flex-row justify-between">
              <div className="w-full md:w-[47%] space-y-2">
                <Label text="Level" />
                <div
                  className={` py-1 w-fit px-3 md:px-6 rounded-[8px] text-sm  sm:text-base font-medium border border-[#D9D9D9] ${" bg-light-greento-white border border-transparent"}`}
                >
                  {data?.data?.level ?? "N/A"}
                </div>
              </div>

              <div className="w-full md:w-[47%] space-y-2">
                <Label text="Status" />
                <Select value={data?.data?.status} onValueChange={handleStatusChange}>
                  <SelectTrigger className="w-full p-[16px] h-12">
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    {["Assigned", "Delayed", "In Progress", "Completed", "Cancelled"].map((status, index) => (
                      <SelectItem key={index} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label text="Description" />
              <p className="text-sm text-[#434343] ">
                Slip and fall occurred at Company due to adverse weather
                conditions caused by snowfall.
              </p>
            </div>

            <div className=" w-full grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <DataBlock
                  title="Count of injured people"
                  value={data?.data?.countOfInjuredPeople ?? "N/A"}
                />
              </div>
              <div>
                <DataBlock title="Start time" value={formatTimestampToTime(data?.data?.createdAt)} />
              </div>
              <div>
                <DataBlock
                  title="Location"
                  value={data?.data?.location ?? "N/A"}
                />
              </div>
              <div>
                <DataBlock
                  title="Damage assets"
                  value={data?.data?.damageAssets ?? "N/A"}
                />
              </div>
              <div>
                <DataBlock
                  title="Finance"
                  value={data?.data?.finance ?? "N/A"}
                />
              </div>
              <div>
                <DataBlock
                  title="Utility effected"
                  value={utilityAffectedString}
                />
              </div>
              <div>
                <div>
                  <Label text={"Upload images"} />
                  <div className="flex items-center gap-2">
                    {
                      data.data.image.map((image: string) =>
                        <div className="w-[67px] h-[67px]">
                          <Image
                            src={image}
                            alt="img"
                            width={100}
                            height={100}
                          />
                        </div>
                      )
                    }
                    {/* <div className="w-[67px] h-[67px]">
                      <Image
                        src={"/details/image3.png"}
                        alt="img"
                        width={100}
                        height={100}
                      />
                    </div> */}
                  </div>
                </div>
              </div>
              <div>
                <div>
                  <Label text={"Digital signature"} />
                  <div className="w-[202px]">
                    <Image
                      src={data.data.signature}
                      alt="img"
                      width={100}
                      height={100}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[40px] p-[32px] space-y-4">
          <h2 className=" text-darkish text-xl">Roles and responsibility </h2>

          <div className="grid grid-cols-1  gap-5 md:gap-0 md:grid-cols-2 border-b-2 py-6">
            <div>
              <DataBlockTwo
                title="Role"
                value="Onsite Emergency Response Manager"
              />
            </div>
            <div className=" space-y-3">
              {rasArra?.map((e, i) => (
                <div
                  key={i}
                  className="flex items-center justify-center w-full"
                >
                  <div className="w-[80%]">
                    <DataBlockTwo
                      title="Assigned to"
                      value="Gilbert Lambert"
                      value2="Manager"
                    />
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <div className="text-base p-2 rounded-full border">
                      <TbVideo />
                    </div>
                    <div className="text-base p-2 rounded-full border">
                      <IoCallOutline />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 gap-5 md:gap-0 md:grid-cols-2 py-6">
            <div>
              <DataBlockTwo title="Role" value="Onsite ERT Leader" />
            </div>
            <div className=" space-y-3">
              {rasArra?.map((e, i) => (
                <div
                  key={i}
                  className="flex items-center justify-center w-full"
                >
                  <div className="w-[80%]">
                    <DataBlockTwo
                      title="Assigned to"
                      value="Daniel Brown"
                      value2="Assistant Manager"
                    />
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <div className="text-base p-2 rounded-full border">
                      <TbVideo />
                    </div>
                    <div className="text-base p-2 rounded-full border">
                      <IoCallOutline />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[40px] p-[32px] space-y-4">
          <h2 className=" text-darkish text-xl">Status updates </h2>
          <div className="space-y-8">
            <div>
              <div className="bg-[#F5F5F5] py-2 px-3">
                {" "}
                <h2 className=" text-darkish text-sm font-medium ">
                  Safety Team
                </h2>
              </div>
              <div>
                {statusArra?.map((e, i) => (
                  <div key={i}>
                    <RowBoxDetailpage {...e} />
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="bg-[#F5F5F5] py-2 px-3">
                {" "}
                <h2 className=" text-darkish text-sm font-medium ">
                  Medical Team
                </h2>
              </div>
              <div>
                {statusArra?.map((e, i) => (
                  <div key={i}>
                    <RowBoxDetailpage {...e} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>

      {timerDialog &&
        (<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-[40px] p-6 w-[450px] shadow-lg">
            <h3 className="text-xl font-semibold mb-1">Stop timer</h3>
            <p className="text-[#636B62] font-normal">Just hit the timer to wrap up the Emerge-x cases, and you'll see the status change to completed! Are you sure you want to stop?</p>
            <div className="flex justify-end gap-4 mt-8">
              <Button className="bg-gradient-to-r from-[#4D514C] to-[#232A21] w-40 h-10" onClick={() => setTimerDialog(false)}>
                Cancel
              </Button>
              <Button className="bg-gradient-to-r from-[#3DA229] to-[#247814] w-40 h-10" onClick={() => handleStopTimer()} >Yes, Stop</Button>
            </div>
          </div>
        </div>)
      }

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>Confirm Status Change</DialogTitle>
            <DialogDescription>Are you sure you want to change the status to "{pendingStatus}"?</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="outline" onClick={confirmStatusChange}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DetailsPage;

interface DataBlockPros {
  title: string;
  value: string;
}
const DataBlock: React.FC<DataBlockPros> = ({ title, value }) => {
  return (
    <div className=" space-y-3">
      <Label text={title} />
      <p className=" text-base md:text-lg text-[#1E1E1E] font-medium ">
        {value}
      </p>
    </div>
  );
};

interface DataBlockTwoPros {
  title: string;
  value: string;
  value2?: string;
}
const DataBlockTwo: React.FC<DataBlockTwoPros> = ({ title, value, value2 }) => {
  return (
    <div>
      <Label text={title} />
      <p className=" text-base  text-[#1E1E1E] font-medium ">{value}</p>
      {value2 && <Label text={value2} />}
    </div>
  );
};
