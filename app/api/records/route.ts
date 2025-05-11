import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { getUserRole } from "@/utils/getRoles";
// GET -> get canceled medical records
export async function GET(request: NextRequest) {
    const supabase = await createClient();
    const result = await getUserRole();

    if (!result) {
        return NextResponse.json(
            { error: "Unauthorized" },
            { status: 401 }
        );
    }

    const { role, userId } = result;

    if (role !== "Doctor" && role !== "Admin") {
        return NextResponse.json(
            { error: "Only for admin doctor " },
            { status: 403 }
        );
    }

    const { data, error } = await supabase
        .from('medical_records')
        .select(`
        *,
        medical_staff(
            users(
                first_name,
                last_name
            )
        ),
        patients(
            users(
                first_name,
                last_name
            )
        )
        `)
        .eq('visit_status', 'Canceled')
        .order('visit_date', { ascending: false });

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data }, { status: 200 });
}