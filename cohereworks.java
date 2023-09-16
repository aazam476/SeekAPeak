package com.example.coheretesttwo;

import androidx.appcompat.app.AppCompatActivity;

import android.os.AsyncTask;
import android.os.Bundle;
import android.util.Log;


import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;


public class MainActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        AsyncThread asyncThread = new AsyncThread();
        try {
            asyncThread.execute().get();


        }
        catch (Exception e)
        {
            Log.d("EXCEPTION", e.toString());
        }
    }

    public class AsyncThread extends AsyncTask<Void, Void, Void>
    {
        @Override
        protected Void doInBackground(Void... voids) {

            String thingtofind;
            //PULL FROM List of possible things right?
            //ex
            //hahah


            thingtofind = "car";






            JSONObject json = new JSONObject();



            try
            {
                OkHttpClient client = new OkHttpClient();

                MediaType mediaType = MediaType.parse("application/json");
                RequestBody body = RequestBody.create(mediaType, "{\"max_tokens\":100,\"truncate\":\"END\",\"return_likelihoods\":\"NONE\",\"prompt\":\"Write a three sentence \'What am I\' riddle where the answer is a " + thingtofind +". Do not state the answer in the response. The third sentence must be \'What am I\'\"}");
                Request request = new Request.Builder()
                        .url("https://api.cohere.ai/v1/generate")
                        .post(body)
                        .addHeader("accept", "application/json")
                        .addHeader("content-type", "application/json")
                        .addHeader("authorization", "Bearer ZQ5jZ7kj3yoGutkdCFFZM5UuL7dksyL9g67kTq3x")
                        .build();

                Response response = client.newCall(request).execute();
                json = new JSONObject(response.body().string());





            }
            catch (Exception e)
            {
                System.out.println(e);
                System.out.println("NOO");
            }
            JSONArray W = null;
            try {
                W = new JSONArray(String.valueOf((json.getJSONArray("generations"))));
            } catch (JSONException e) {
                throw new RuntimeException(e);
            }
            try {
                JSONObject WW = new JSONObject(String.valueOf((W.getJSONObject(0))));

                //HERES THE RIDDLE TEXT DONT WORRY ABOUT THE WEIRD TRY CATCHES IT DIDNT WORK OTHERWISE
                String riddleText = WW.getString("text");
                System.out.println(riddleText);



            } catch (JSONException e) {
                throw new RuntimeException(e);
            }



            return null;
        }
    }

}