package com.example.scannerapp;

import static android.content.ContentValues.TAG;

import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;

import android.content.Context;
import android.content.Intent;
import android.graphics.Color;
import android.os.AsyncTask;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;
import android.widget.Toast;

import com.google.zxing.integration.android.IntentIntegrator;
import com.google.zxing.integration.android.IntentResult;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import org.json.*;
import org.w3c.dom.Text;

public class scan_Page extends AppCompatActivity implements View.OnClickListener {



    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_scan_page);

         Button scanBtn = findViewById(R.id.group89_button);

        // adding listener to the button
        scanBtn.setOnClickListener(this);

    }
    @Override
    public void onClick(View v) {
        // we need to create the object
        // of IntentIntegrator class
        // which is the class of QR library
        IntentIntegrator intentIntegrator = new IntentIntegrator(this);
        intentIntegrator.setPrompt("Scan a barcode or QR Code");
        intentIntegrator.setOrientationLocked(true);
        intentIntegrator.initiateScan();
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, @Nullable Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        IntentResult intentResult = IntentIntegrator.parseActivityResult(requestCode, resultCode, data);
        // if the intentResult is null then
        // toast a message as "cancelled"
        if (intentResult != null) {
            if (intentResult.getContents() == null) {
                Toast.makeText(getBaseContext(), "Cancelled", Toast.LENGTH_SHORT).show();
            } else {
                // if the intentResult is not null we'll set
                // the content and format of scan message
//                messageText.setText(intentResult.getContents());
//                messageFormat.setText(intentResult.getFormatName());

                //Go to api and check if student is registered
                String url1 = "http://192.168.43.101:8080/online/Test.php?REGISTRATION=" + intentResult.getContents();
                GetMethodDemo GetMethodDemo = new GetMethodDemo(); // can add params for a constructor if needed
                new GetMethodDemo().execute(url1);

            }
        } else {
            super.onActivityResult(requestCode, resultCode, data);
        }
    }

    public class GetMethodDemo extends AsyncTask<String , Void ,String>
    {
        String server_response;
        Context mContext;

        @Override
        protected String doInBackground(String... strings) {

            URL url;
            HttpURLConnection urlConnection = null;




            try {
                url = new URL(strings[0]);
                urlConnection = (HttpURLConnection) url.openConnection();

                int responseCode = urlConnection.getResponseCode();

                if(responseCode == HttpURLConnection.HTTP_OK){
                    server_response = readStream(urlConnection.getInputStream());
//                    Log.v("CatalogClient", server_response);
                }

            } catch (MalformedURLException e) {
                e.printStackTrace();
            } catch (IOException e) {
                e.printStackTrace();
            }

            return null;
        }

        @Override
        protected void onPostExecute(String s) {
            super.onPostExecute(s);

            final TextView regNo = (TextView) findViewById(R.id.regNo);
            final TextView COURSE = (TextView) findViewById(R.id.COURSE);
            final TextView  status_R = (TextView) findViewById(R.id. status_R);
            final View v =  findViewById(R.id.TABLE);

            //returning toast message::


            //Get values of array::
            try {
                // Parse the JSON string into a JSONArray object
                JSONObject jsonArray = new JSONObject(server_response);

                // Loop through each object in the array
                for (int i = 0; i < jsonArray.length(); i++) {
                    JSONObject obj = jsonArray;

                    // Access the values of the object using their keys
                    int STATUS = obj.getInt("STATUS");
//                        String name = obj.getString("name");
//                        int age = obj.getInt("age");

                    // Do something with the values



                    // If status is 1, print values into the box::
                    if (STATUS== 1){
                        int REGISTRATION = obj.getInt("REGISTRATION");
                        String COURSE_VAL = obj.getString("COURSE");

                        status_R.setBackgroundColor(Color.GREEN);
                        v.setVisibility(View.VISIBLE);
                        regNo.setText(String.valueOf(REGISTRATION));
                        COURSE.setText(COURSE_VAL);
                        status_R.setText("Registered");

                    }else if (STATUS== 2){
                        //Show a toast message showing that user is not registered:::
                        int REGISTRATION = obj.getInt("REGISTRATION");
                        String COURSE_VAL = obj.getString("COURSE");


                        v.setVisibility(View.VISIBLE);
                        status_R.setBackgroundColor(Color.RED);
                        regNo.setText(String.valueOf(REGISTRATION));
                        COURSE.setText(COURSE_VAL);
                        status_R.setText(" Not- Registered");

                    }else if (STATUS== 3){
                        // toat to show that student is unknown::::
                        v.setVisibility(View.GONE);
                        Log.d(TAG, "unknown");
                        Toast.makeText( scan_Page.this, "Sanned Code....Uknown", Toast.LENGTH_LONG).show();

                    }

                }
            } catch (JSONException e) {
                // Handle any exceptions that may occur while parsing the JSON string
                e.printStackTrace();
            }


//                JSONObject jObj = new JSONObject(server_response);
//                if (jObj.getInt("status") == 0)
//                {
//
//                    Log.e("status", "" + "Denied");
//                    Toast.makeText( scan_Page.this, "Student is not registered!", Toast.LENGTH_LONG).show();
//
////
////                    Intent intent = new Intent(MainActivity.this, scan_Page.class);
////                    intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
////                    MainActivity.this.startActivity(intent);
//
//
//
//                }
//                else
//                {
//
//                    Log.e("status", "Allowed");
//                    //Acess the object and store values into variables:
//                    Toast.makeText( scan_Page.this, server_response, Toast.LENGTH_LONG).show();
//
//                }

        }











// Converting InputStream to String

        private String readStream(InputStream in) {
            BufferedReader reader = null;
            StringBuffer response = new StringBuffer();
            try {
                reader = new BufferedReader(new InputStreamReader(in));
                String line = "";
                while ((line = reader.readLine()) != null) {
                    response.append(line);
                }
            } catch (IOException e) {
                e.printStackTrace();
            } finally {
                if (reader != null) {
                    try {
                        reader.close();
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                }
            }
            return response.toString();


        }




    }

}