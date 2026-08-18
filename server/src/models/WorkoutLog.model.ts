import mongoose, { Document, Schema } from "mongoose";

interface IWorkoutSet {
    reps: number;
    weight: number;
    rpe?: number;
}

export interface IWorkout extends Document {
    userId: mongoose.Types.ObjectId;
    exercises: {
        exerciseId: mongoose.Types.ObjectId;
        exerciseName: string;
        sets: IWorkoutSet[];
    }[];
    duration: number;
    caloriesBurned: number;
    completedAt: Date;
    completed: boolean;
}

const workoutSetSchema = new Schema<IWorkoutSet>(
    {
        reps: {
            type: Number,
            required: true,
            min: 1,
        },

        weight: {
            type: Number,
            required: true,
            min: 0,
        },

        rpe: {
            type: Number,
            min: 1,
            max: 10,
        },
    },
    { _id: false }
);

const workoutSchema = new Schema<IWorkout>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        exercises: [
            {
                exerciseId: {
                    type: Schema.Types.ObjectId,
                    ref: "Exercise",
                    required: true,
                },

                exerciseName: {
                    type: String,
                    required: true,
                },

                sets: {
                    type: [workoutSetSchema],
                    required: true,
                },
            },
        ],

        duration: {
            type: Number,
            required: true,
            min: 0,
        },

        caloriesBurned: {
            type: Number,
            required: true,
            min: 0,
        },

        completedAt: {
            type: Date,
            default: Date.now,
        },

        completed: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

export const Workout = mongoose.model<IWorkout>(
    "Workout",
    workoutSchema
);